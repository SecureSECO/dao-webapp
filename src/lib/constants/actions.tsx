/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  MintTokensInputProps,
  ProposalFormMintData,
} from '@/src/components/newProposal/actions/MintTokensInput';
import { MintTokensInput } from '@/src/components/newProposal/actions/MintTokensInput';
import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import DefaultAction from '@/src/components/proposal/actions/DefaultAction';
import MintAction, {
  ProposalMintAction,
} from '@/src/components/proposal/actions/MintAction';
import { TOKENS } from '@/src/lib/constants/tokens';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { parseUnits } from 'ethers/lib/utils.js';
import { IconType } from 'react-icons';
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

interface ActionViewProps extends AccordionItemProps {
  action: IProposalAction;
}

type Action<TAction, TFormProps, TInputData> = {
  method: string;
  interface: string;
  // Used on proposal tags
  label: string;
  icon: IconType;
  // Component to view the action in the UI
  view: (props: ViewActionProps<TAction>) => JSX.Element;
  // Component to be used inside a form to input data for the action
  form: (props: TFormProps) => JSX.Element;
  /**
   *
   * @param input
   * @returns
   */
  parseInput: (input: TInputData) => Promise<IProposalAction>;
};

interface ViewActionProps<TAction> extends AccordionItemProps {
  action: TAction;
}

type Actions = {
  mint_tokens: Action<
    ProposalMintAction,
    MintTokensInputProps,
    ProposalFormMintData
  >;
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
    form: MintTokensInput,
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
