/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

/**
 * @fileoverview This file contains logic to generalize proposal actions.
 * It contains a list of all actions that can be performed on a proposal and serves
 * as the starting point to add new proposal actions.
 */

import Diamond from '@/src/components/icons/Diamond';
import {
  ChangeParamInput,
  ProposalFormChangeParamData,
  emptyChangeParamData,
} from '@/src/components/newProposal/actions/ChangeParamInput';
import {
  MergePRInput,
  ProposalFormMergeData,
  emptyMergeData,
} from '@/src/components/newProposal/actions/MergePRInput';
import {
  MintTokensInput,
  ProposalFormMintData,
  emptyMintData,
} from '@/src/components/newProposal/actions/MintTokensInput';
import {
  ProposalFormWhitelistData,
  WhitelistMemberInput,
  emptyWhitelistData,
} from '@/src/components/newProposal/actions/WhitelistMemberInput';
import {
  ProposalFormWithdrawData,
  WithdrawAssetsInput,
  emptyWithdrawData,
} from '@/src/components/newProposal/actions/WithdrawAssetsInput';
import {
  ApproveSpendingAction,
  ProposalApproveSpendingAction,
} from '@/src/components/proposal/actions/ApproveSpendingAction';
import {
  ChangeParamAction,
  ProposalChangeParamAction,
} from '@/src/components/proposal/actions/ChangeParamAction';
import {
  DiamondCutAction,
  ProposalDiamondCutAction,
} from '@/src/components/proposal/actions/DiamondCutAction';
import MergeAction, {
  ProposalMergeAction,
} from '@/src/components/proposal/actions/MergeAction';
import MintAction, {
  ProposalMintAction,
} from '@/src/components/proposal/actions/MintAction';
import {
  ProposalWhitelistAction,
  WhitelistAction,
} from '@/src/components/proposal/actions/WhitelistAction';
import WithdrawAction, {
  ProposalWithdrawAction,
} from '@/src/components/proposal/actions/WithdrawAction';
import { TOKENS } from '@/src/lib/constants/tokens';
import { lowerCaseFirst } from '@/src/lib/utils';
import { parseTokenAmount } from '@/src/lib/utils/token';
import { TokenType } from '@aragon/sdk-client';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { BigNumber } from 'ethers';
import { IconType } from 'react-icons';
import { FaGithub } from 'react-icons/fa';
import {
  HiBanknotes,
  HiOutlineCheckCircle,
  HiOutlineCircleStack,
  HiOutlineCog,
  HiUserPlus,
} from 'react-icons/hi2';

/**
 * Type for different proposal form action data.
 */
export type ProposalFormActionData =
  | ProposalFormWithdrawData
  | ProposalFormMintData
  | ProposalFormMergeData
  | ProposalFormChangeParamData
  | ProposalFormWhitelistData;
// Add data type for form data of new proposal actions here:
//| ...

type Actions = {
  mint_tokens: ActionData<ProposalMintAction, ProposalFormMintData>;
  merge_pr: ActionData<ProposalMergeAction, ProposalFormMergeData>;
  withdraw_assets: ActionData<
    ProposalWithdrawAction,
    ProposalFormWithdrawData,
    'native' | 'erc20' | 'erc721' | 'erc1155'
  >;
  change_param: ActionData<
    ProposalChangeParamAction,
    ProposalFormChangeParamData
  >;
  whitelist_member: ActionData<
    ProposalWhitelistAction,
    ProposalFormWhitelistData
  >;
  diamond_cut: ActionData<ProposalDiamondCutAction, null>;
  approve_spending: ActionData<ProposalApproveSpendingAction, null>;

  // Add new proposal actions here
  // ...
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
    longLabel: 'Mint tokens',
    icon: HiOutlineCircleStack,
    view: MintAction,
    input: MintTokensInput,
    emptyInputData: emptyMintData,
    maxPerProposal: 1,
    parseInput: (input) => {
      const amounts = input.wallets.map((wallet) =>
        parseTokenAmount(wallet.amount.toString(), TOKENS.rep.decimals)
      );

      if (amounts.some((x) => x === null)) {
        return null;
      }

      return {
        method: ACTIONS.mint_tokens.method as string,
        interface: ACTIONS.mint_tokens.interface,
        params: {
          _addresses: input.wallets.map((wallet) => wallet.address),
          _amounts: amounts as BigNumber[], // Guaranteed by null check above.
        },
      };
    },
  },
  merge_pr: {
    method: 'merge(string,string,string,string)',
    interface: 'IGithubPullRequestFacet',
    label: 'Merge PR',
    longLabel: 'Merge pull request',
    icon: FaGithub,
    view: MergeAction,
    input: MergePRInput,
    emptyInputData: emptyMergeData,
    parseInput: (input) => {
      const url = new URL(input.url);
      const owner = url.pathname.split('/')[1];
      const repo = url.pathname.split('/')[2];
      const pullNumber = url.pathname.split('/')[4];
      return {
        method: ACTIONS.merge_pr.method as string,
        interface: ACTIONS.merge_pr.interface,
        params: {
          _owner: owner,
          _repo: repo,
          _pull_number: pullNumber,
          _sha: input.sha,
        },
      };
    },
  },
  withdraw_assets: {
    method: {
      native: 'WithdrawNative',
      erc20: 'WithdrawERC20',
      erc721: 'WithdrawERC721',
      erc1155: 'WithdrawERC1155',
    },
    interface: 'DAO',
    label: 'Withdraw assets',
    longLabel: 'Withdraw assets',
    icon: HiBanknotes,
    view: WithdrawAction,
    input: WithdrawAssetsInput,
    emptyInputData: emptyWithdrawData,
    parseInput: (input) => {
      const _amount = parseTokenAmount(
        input.amount.toString(),
        parseInt(input.tokenDecimals)
      );
      const _from = input.daoAddress;
      if (
        _amount === null ||
        (_from === undefined && input.tokenType !== TokenType.NATIVE)
      )
        return null;

      const _contractAddress =
        input.tokenAddress === 'custom'
          ? (input.tokenAddressCustom as string)
          : input.tokenAddress;

      switch (input.tokenType) {
        case TokenType.NATIVE:
          return {
            interface: ACTIONS.withdraw_assets.interface,
            method: ACTIONS.withdraw_assets.method.native,
            params: {
              _to: input.recipient,
              _value: _amount,
            },
          };
        case TokenType.ERC20:
          return {
            interface: ACTIONS.withdraw_assets.interface,
            method: ACTIONS.withdraw_assets.method.erc20,
            params: {
              _from,
              _to: input.recipient,
              _amount,
              _contractAddress,
            },
          };
        case TokenType.ERC721:
          if (input.tokenID === undefined) return null;
          return {
            interface: ACTIONS.withdraw_assets.interface,
            method: ACTIONS.withdraw_assets.method.erc721,
            params: {
              _from,
              _to: input.recipient,
              _tokenId: BigNumber.from(input.tokenID),
              _contractAddress,
            },
          };
        // ERC1155 is not supported by Aragon SDK
        // If it gets support in the future, uncomment this code
        // case TokenType.ERC1155:
        //   if (input.tokenID === undefined) return null;
        //   return {
        //     interface: ACTIONS.withdraw_assets.interface,
        //     method: ACTIONS.withdraw_assets.method.erc1155,
        //     params: {
        //       _from,
        //       _to: input.recipient,
        //       _tokenId: input.tokenID,
        //       _contractAddress,
        //     },
        //   };
      }
    },
  },
  change_param: {
    // The method and interface for this action are dynamically generated in the parseInput function
    // The actions being fetched are first parsed to make sure all change param actions have this method and interface
    method: 'ChangeParam',
    interface: 'DAO',
    label: 'Change param',
    longLabel: 'Change plugin param',
    icon: HiOutlineCog,
    view: ChangeParamAction,
    input: ChangeParamInput,
    emptyInputData: emptyChangeParamData,
    parseInput: (input) => {
      try {
        let parsedValue: string | number | boolean | BigNumber = input.value;
        if (
          input.type === 'uint8' ||
          input.type === 'uint16' ||
          input.type === 'uint32'
        )
          parsedValue = Number.parseInt(input.value);
        else if (input.type === 'boolean' && input.value === 'false')
          parsedValue = false;
        else if (input.type === 'boolean' && input.value === 'true')
          parsedValue = true;
        else if (input.type === 'string' || input.type === 'address')
          parsedValue = input.value;
        else parsedValue = BigNumber.from(input.value);

        return {
          method: `set${input.parameter}(${input.type})`,
          interface: input.plugin,
          params: {
            [`_${lowerCaseFirst(input.parameter)}`]: parsedValue,
          },
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  },
  whitelist_member: {
    method: 'whitelist(address)',
    interface: 'IMembershipWhitelisting',
    label: 'Whitelist',
    longLabel: 'Whitelist member',
    icon: HiUserPlus,
    view: WhitelistAction,
    input: WhitelistMemberInput,
    emptyInputData: emptyWhitelistData,
    parseInput: (input) => ({
      method: ACTIONS.whitelist_member.method as string,
      interface: ACTIONS.whitelist_member.interface,
      params: {
        _address: input.address,
      },
    }),
  },
  diamond_cut: {
    method: 'diamondCut(tuple[])',
    interface: 'IDiamondCut',
    label: 'Diamond cut',
    longLabel: 'Diamond cut',
    icon: Diamond,
    view: DiamondCutAction,
    // There is not support for adding diamond cut actions through the webapp
    // Any diamond cut action will have been created through other means, but can be viewed in the webapp to a certain extent
    input: null,
    emptyInputData: null,
    parseInput: () => null,
  },
  approve_spending: {
    method: 'ApproveERC20',
    interface: 'DAO',
    label: 'Approve spending',
    longLabel: 'Approve ERC20 spending',
    icon: HiOutlineCheckCircle,
    view: ApproveSpendingAction,
    input: null,
    emptyInputData: null,
    parseInput: () => null,
  },
  // Add new proposal actions here:
  // ...
};

export type ActionName = keyof typeof ACTIONS;

interface ViewActionProps<TAction> extends AccordionItemProps {
  action: TAction;
}

/**
 * Type for the data of a proposal action.
 * @param TAction Type of the action as expected by the SDK
 * @param TFormData Type of the data of the input form for this action
 * @param TMethod Optional string literals for the method name identifiers for this action (see below)
 */
type ActionData<TAction, TFormData, TMethod extends string | void = void> = {
  /**
   * Interface containing the smart contract function that will be called for this action.
   */
  interface: string;
  /**
   * Method of the smart contract function that will be called for this action.
   * Can be a string or an object with multiple method names.
   *
   * In the case of an object, the key is an identifier for the method to be used to access the method name in the UI code
   * (e.g. to be able to check which pre-defined version of an action you are dealing with),
   * and the value is the method name as a string.
   *
   * Wondering how these types work? Check this out: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
   */
  method: [TMethod] extends [string]
    ? {
        [key in TMethod]: string;
      }
    : string;
  /**
   * Label used in the UI to describe this action.
   */
  label: string;
  /**
   * Longer label used in the UI to describe this action.
   * This label is used in the new-proposal form.
   */
  longLabel: string;
  icon: IconType;
  /**
   * @param props Props to be passed to the component (with at least the right action)
   * @returns Component to be used to view the action in the UI
   */
  view: (props: ViewActionProps<TAction>) => JSX.Element;
  /**
   * @returns Component to be used inside a form to input data for the action
   * If it is null, this action is view only and thus can not be created
   */
  input: (() => JSX.Element) | null;
  /**
   * Data to be used as initial values for the input form for this action.
   * May only be null if input is also null
   */
  emptyInputData: TFormData;
  /**
   * Maximum number of this action that can be added to a single proposal in the new-proposal form
   * @default undefined // No limit
   */
  maxPerProposal?: number;
  /**
   * Parses the data from the input form for this action to a format expected by the SDK.
   * @param input Data from the input form for this action
   * @param provider Provider to use to optionally fetch data from the blockchain
   * @returns Instance of Action as expected by the SDK
   */
  parseInput: (input: TFormData) => TAction | null;
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
export const getIdentifier = (action: Action | ActionData<any, any>) =>
  `${action.interface}.${action.method}`;

/**
 * Object that maps an action identifier to a more readable name as defined in the ACTIONS object.
 * @example
 * const actionName = actionNames['IERC20MultiMinterFacet.multimint(address[],uint256[])']
 * // actionName === 'mint_tokens'
 */
export const actionNames: { [identifier: string]: ActionName } = {};
// Developer's note: the actonNames object is expanded upon with the identifiers for all possible
// change_param action interfaces and methods in DiamondGovernanceSDK.tsx, after fetching the
// list of all possible variables to change in the DAO from the SDK.
Object.entries(ACTIONS).forEach(([name, action]) => {
  if (typeof action.method === 'string')
    actionNames[getIdentifier({ ...action, method: action.method })] =
      name as ActionName;
  // If the action.method is an object, add all methods to the actionNames object
  else
    Object.values(action.method).forEach(
      (method) =>
        (actionNames[getIdentifier({ ...action, method })] = name as ActionName)
    );
});

/**
 * Function to get a more readable name for a proposal action.
 * @param action Instance of Action to get a more readable name for
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
