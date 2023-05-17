/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ChangeParamInput,
  ProposalFormChangeParamData,
} from '@/src/components/newProposal/actions/ChangeParamInput';
import {
  MergePRInput,
  ProposalFormMergeData,
} from '@/src/components/newProposal/actions/MergePRInput';
import { ProposalFormMintData } from '@/src/components/newProposal/actions/MintTokensInput';
import { MintTokensInput } from '@/src/components/newProposal/actions/MintTokensInput';
import {
  ProposalFormWithdrawData,
  WithdrawAssetsInput,
} from '@/src/components/newProposal/actions/WithdrawAssetsInput';
import DefaultAction from '@/src/components/proposal/actions/DefaultAction';
import MergeAction, {
  ProposalMergeAction,
} from '@/src/components/proposal/actions/MergeAction';
import MintAction, {
  ProposalMintAction,
} from '@/src/components/proposal/actions/MintAction';
import WithdrawAction, {
  ProposalWithdrawAction,
} from '@/src/components/proposal/actions/WithdrawAction';
import { TOKENS } from '@/src/lib/constants/tokens';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { parseUnits } from 'ethers/lib/utils.js';
import { IconType } from 'react-icons';
import { FaGithub } from 'react-icons/fa';
import { Action } from '@plopmenz/diamond-governance-sdk';
import {
  HiBanknotes,
  HiOutlineCircleStack,
  HiOutlineCog,
} from 'react-icons/hi2';
import {
  ChangeParamAction,
  ProposalChangeParamAction,
} from '@/src/components/proposal/actions/ChangeParamAction';
import { getTokenInfo } from '@/src/lib/token-utils';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { Provider } from '@wagmi/core';

/**
 * @fileoverview This file contains logic to generalize proposal actions.
 * It contains a list of all actions that can be performed on a proposal and serves
 * as the starting point to add new proposal actions.
 */

type Actions = {
  mint_tokens: ActionData<ProposalMintAction, ProposalFormMintData>;
  merge_pr: ActionData<ProposalMergeAction, ProposalFormMergeData>;
  withdraw_assets: ActionData<ProposalWithdrawAction, ProposalFormWithdrawData>;
  change_param: ActionData<
    ProposalChangeParamAction,
    ProposalFormChangeParamData
  >;
};

/**
 * Data for specific proposal actions, consisting of components to render the action, its method, interface, label, icon and input,
 * and a function to parse the form input for that action into a proposal action.
 */
export const ACTIONS: Actions = {
  mint_tokens: {
    method: 'multimint(address[],uint256[])',
    interface: 'IERC20MultiMinterFacet',
    label: 'Mint tokens',
    icon: HiOutlineCircleStack,
    view: MintAction,
    input: MintTokensInput,
    parseInput: async (input) => ({
      method: ACTIONS.mint_tokens.method,
      interface: ACTIONS.mint_tokens.interface,
      params: {
        _addresses: input.wallets.map((wallet) => wallet.address),
        _amounts: input.wallets.map((wallet) => {
          return parseUnits(wallet.amount.toString(), TOKENS.rep.decimals);
        }),
      },
    }),
  },
  merge_pr: {
    method: 'mergePullRequest(string,string,string)',
    interface: 'IGithubPullRequestFacet',
    label: 'Merge PR',
    icon: FaGithub,
    view: MergeAction,
    input: MergePRInput,
    parseInput: async (input) => {
      const url = new URL(input.url);
      const owner = url.pathname.split('/')[1];
      const repo = url.pathname.split('/')[2];
      const pullNumber = url.pathname.split('/')[4];
      return {
        method: ACTIONS.merge_pr.method,
        interface: ACTIONS.merge_pr.interface,
        params: {
          _owner: owner,
          _repo: repo,
          _pull_number: pullNumber,
        },
      };
    },
  },
  withdraw_assets: {
    method: 'withdraw(string,uint256)', // FIXME: not the correct method yet
    interface: 'IWithdraw', // FIXME: not the correct interface yet
    label: 'Withdraw assets',
    icon: HiBanknotes,
    view: WithdrawAction,
    input: WithdrawAssetsInput,
    parseInput: async (input, provider) => {
      // Fetch token info of the token to withdraw to access its decimals
      const tokenAddress =
        input.tokenAddress === 'custom'
          ? (input.tokenAddressCustom as string)
          : input.tokenAddress;
      try {
        const tokenInfo = await getTokenInfo(
          input.tokenAddress,
          provider,
          PREFERRED_NETWORK_METADATA.nativeCurrency
        );

        return {
          method: ACTIONS.withdraw_assets.method,
          interface: ACTIONS.withdraw_assets.interface,
          params: {
            _to: input.recipient,
            // Convert to correct number of tokens using the fetched decimals
            _amount: parseUnits(input.amount.toString(), tokenInfo.decimals),
            _tokenAddress: tokenAddress,
          },
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  },
  change_param: {
    method: 'changeParameter(string,uint256)',
    interface: 'IChangeParameter',
    label: 'Change param',
    icon: HiOutlineCog,
    view: ChangeParamAction,
    input: ChangeParamInput,
    parseInput: async (input) => {
      return {
        method: ACTIONS.change_param.method,
        interface: ACTIONS.change_param.interface,
        params: {
          _plugin: input.plugin,
          _param: input.parameter,
          _value: input.value,
        },
      };
    },
  },
  // unknown: {
  //   method: '',
  //   interface: '',
  //   label: 'Unknown',
  //   icon: HiOutlineQuestionMarkCircle,
  //   view: DefaultAction,
  //   form: () => <></>,
  //   parseInput: async () => ({
  //     method: '',
  //     interface: '',
  //     params: {},
  //   }),
  // },
};

export type ActionName = keyof typeof ACTIONS;

export interface ProposalFormAction {
  name: ActionName;
}

interface ViewActionProps<TAction> extends AccordionItemProps {
  action: TAction;
}

type ActionData<TAction, TFormData> = {
  // Method and interface to call on the smart contract
  method: string;
  interface: string;
  // Used on proposal tags
  label: string;
  icon: IconType;
  // Component to view the action in the UI
  view: (props: ViewActionProps<TAction>) => JSX.Element;
  // Component to be used inside a form to input data for the action
  input: () => JSX.Element;
  /**
   * Parses the data from the input form for this action to a format expected by the SDK.
   * @param input Data from the input form for this action
   * @param provider Provider to use to optionally fetch data from the blockchain
   * @returns Instance of Action as expected by the SDK
   */
  parseInput: (input: TFormData, provider: Provider) => Promise<TAction | null>;
};

/**
 * Object that maps an action identifier to a more readable name as defined in the ACTIONS object.
 * @example
 * const actionName = actionNames['IERC20MultiMinterFacet.multimint(address[],uint256[])']
 * // actionName === 'mint_tokens'
 */
const actionNames: { [identifier: string]: ActionName } = {};
Object.entries(ACTIONS).forEach(([name, action]) => {
  actionNames[getIdentifier(action)] = name as ActionName;
});

/**
 * Function to get a more readable name for a proposal action.
 * @param action Instance of IProposalAction to get a more readable name for
 * @returns Name of the action as the ActionName type
 * @example
 * const action = {
 *  interface: "IERC20MultiMinterFacet",
 *  method: "multimint(address[],uint256[])",
 *  params: { ... }
 * }
 * const name = actionToName(action);
 * console.log(name); // "mint_tokens"
 */
export const actionToName = (action: Action): ActionName | undefined => {
  const identifier = getIdentifier(action);
  return actionNames[identifier];
};

/**
 * Get the identifier for an action. An identifier is a string that uniquely identifies an action, consisting of the interface and method name
 * of the smart contract function that will eventually be called for this action.
 * @param action Action to get the identifier for
 * @returns A unique identifier for an action, based on its interface and method name
 * @example
 * const action = {
 *  interface: "IERC20MultiMinterFacet",
 *  method: "multimint(address[],uint256[])",
 *  params: { ... }
 * }
 * const identifier = getIdentifier(action);
 * console.log(identifier); // "IERC20MultiMinterFacet.multimint(address[],uint256[])"
 */
const getIdentifier = (action: Action | ActionData<any, any>) =>
  `${action.interface}.${action.method}`;
