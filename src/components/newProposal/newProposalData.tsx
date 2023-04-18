/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ProposalResource } from '@/src/hooks/useProposal';

// STEP 1 DATA

// STEP 2 DATA

// STEP 3 DATA
export interface ProposalFormActions {
  actions: ProposalFormAction[];
}

export const emptyActionWithdraw: ActionWithdraw = {
  amount: 0,
  name: 'withdraw_assets',
  to: '',
  tokenAddress: '',
  tokenBalance: 0,
  tokenDecimals: 0,
  tokenImgUrl: '',
  tokenName: '',
  tokenSymbol: '',
  isCustomToken: true,
};

export type ActionWithdraw = {
  amount: number;
  name: 'withdraw_assets';
  to: string;
  tokenAddress: string;
  tokenBalance: number;
  tokenDecimals: number;
  tokenImgUrl: string;
  tokenName: string;
  tokenSymbol: string;
  isCustomToken: boolean;
};

export const emptyWithdrawAction: ProposalFormWithdrawData = {
  name: 'withdraw_assets',
  recipient: '',
  tokenAddress: '',
  amount: '',
};

export type ProposalFormWithdrawData = {
  name: 'withdraw_assets';
  recipient: string;
  tokenAddress: string;
  amount: string;
};

export type ProposalFormAction =
  | ProposalFormWithdrawData
  | ProposalFormMintAction;
