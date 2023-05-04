/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import {
  Actions,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import { NewProposalFormProvider } from '@/src/pages/NewProposal';
import { emptyWithdrawData } from '@/src/components/newProposal/actions/WithdrawAssetsInput';
import { emptyMintData } from '@/src/components/newProposal/actions/MintTokensInput';
import { emptyMergeData } from '../actions/MergePRInput';

const meta: Meta<typeof Actions> = {
  component: Actions,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Actions>;

const FormProviderDecorator = (Story: any, options: any) => {
  const { args } = options;

  return (
    <NewProposalFormProvider step={3} dataStep3={args.data}>
      <Story />
    </NewProposalFormProvider>
  );
};

export const Primary: Story = {
  args: {
    data: { actions: [emptyMintData, emptyWithdrawData, emptyMergeData] },
  },
  decorators: [FormProviderDecorator],
};

export const Empty: Story = {
  args: { data: { actions: [] } },
  decorators: [FormProviderDecorator],
};
