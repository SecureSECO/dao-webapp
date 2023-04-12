/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Meta, StoryObj } from '@storybook/react';

import { StepThree } from './StepThreeActions';
import { NewProposalFormProvider } from '@/src/pages/NewProposal';
import {
  StepThreeData,
  emptyActionMintTokenFormData,
  emptyActionWithdrawFormData,
} from './newProposalData';

const meta: Meta<typeof StepThree> = {
  component: StepThree,
};

export default meta;
type Story = StoryObj<typeof StepThree>;

const FormProviderDecoratorFactory = (data: StepThreeData): any => {
  // eslint-disable-next-line react/display-name
  return (Story: any) => (
    <NewProposalFormProvider step={3} dataStep3={data}>
      <Story />
    </NewProposalFormProvider>
  );
};

const emptyActions = {
  actions: [emptyActionMintTokenFormData, emptyActionWithdrawFormData],
};

export const Primary: Story = {
  decorators: [FormProviderDecoratorFactory(emptyActions)],
};

const mintTokensAction: StepThreeData = {
  actions: [
    { name: 'mint_tokens', wallets: [{ address: '0x123', amount: 1 }] },
  ],
};
export const MintTokensAction: Story = {
  decorators: [FormProviderDecoratorFactory(mintTokensAction)],
};
