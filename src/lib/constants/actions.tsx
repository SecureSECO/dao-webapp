/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ProposalFormChangeParameter } from '@/src/components/newProposal/actions/ChangeParametersInput';
import {
  MergePRInput,
  ProposalFormMergeData,
} from '@/src/components/newProposal/actions/MergePRInput';
import {
  MintTokensInputProps,
  ProposalFormMintData,
} from '@/src/components/newProposal/actions/MintTokensInput';
import { MintTokensInput } from '@/src/components/newProposal/actions/MintTokensInput';
import { ProposalFormWithdrawData } from '@/src/components/newProposal/actions/WithdrawAssetsInput';
import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import DefaultAction from '@/src/components/proposal/actions/DefaultAction';
import MergeAction, {
  ProposalMergeAction,
} from '@/src/components/proposal/actions/MergeAction';
import MintAction, {
  ProposalMintAction,
} from '@/src/components/proposal/actions/MintAction';
import { ProposalWithdrawAction } from '@/src/components/proposal/actions/WithdrawAction';
import { TOKENS } from '@/src/lib/constants/tokens';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { parseUnits } from 'ethers/lib/utils.js';
import { IconType } from 'react-icons';
import { FaGithub } from 'react-icons/fa';
import {
  HiOutlineCircleStack,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi2';

/**
 * This file contains
 */

export type ActionName =
  | 'mint_tokens'
  | 'merge_pr'
  | 'withdraw_assets'
  | 'change_param'
  | 'unknown';

export interface ProposalFormAction {
  name: ActionName;
}
export type ProposalFormActionData =
  | ProposalFormWithdrawData
  | ProposalFormMintData
  | ProposalFormMergeData
  | ProposalFormChangeParameter;
// export interface ProposalFormAction {
//   name: ActionName;
// }

interface ActionViewProps<TAction> extends AccordionItemProps {
  action: TAction;
}

type Action<TAction, TInputData> = {
  method: string;
  interface: string;
  // Used on proposal tags
  label: string;
  icon: IconType;
  // Component to view the action in the UI
  view: (props: ActionViewProps<TAction>) => JSX.Element;
  // Component to be used inside a form to input data for the action
  input: () => JSX.Element;
  /**
   *
   * @param input
   * @returns
   */
  parseInput: (input: TInputData) => Promise<TAction>;
};

type Actions = {
  mint_tokens: Action<ProposalMintAction, ProposalFormMintData>;
  withdraw_assets: Action<ProposalWithdrawAction, ProposalFormWithdrawData>;
  merge_pr: Action<ProposalMergeAction, ProposalFormMergeData>;
};

// merge: FaGithub
// withdraw: HiBankNotes
/// param: HiOutlineCog
export const actions: Actions = {
  mint_tokens: {
    method: 'multimint(address[],uint256[])',
    interface: 'IERC20MultiMinterFacet',
    label: 'Mint tokens',
    icon: HiOutlineCircleStack,
    view: MintAction,
    input: MintTokensInput,
    parseInput: async (input: ProposalFormMintData) => ({
      method: actions.mint_tokens.method,
      interface: actions.mint_tokens.interface,
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
    parseInput: async (input: ProposalFormMergeData) => {
      const url = new URL(input.inputs.url);
      const owner = url.pathname.split('/')[1];
      const repo = url.pathname.split('/')[2];
      const pullNumber = url.pathname.split('/')[4];
      return {
        method: 'merge(string,string,string)',
        interface: 'IGithubPullRequestFacet',
        params: {
          _owner: owner,
          _repo: repo,
          _pull_number: pullNumber,
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

/**
 * Object that maps an action identifier to a more readable name.
 */
const actionNames: { [identifier: string]: ActionName } = {
  'IERC20MultiMinterFacet.multimint(address[],uint256[])': 'mint_tokens',
  'IGithubPullRequestFacet.mergePullRequest(string,string,string)': 'merge_pr',
  'IWithdraw.withdraw': 'withdraw_assets',
  'IChange.change': 'change_param',
};

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
export const actionToName = (action: IProposalAction): ActionName => {
  const identifier = getIdentifier(action);
  return actionNames[identifier] ?? 'unknown';
};
const getIdentifier = (action: IProposalAction) =>
  `${action.interface}.${action.method}`;
