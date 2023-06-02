/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Actions } from '@/src/components/newProposal/steps/Actions';
import { NewProposalFormProvider } from '@/src/pages/NewProposal';
import { TokenType } from '@aragon/sdk-client';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Actions> = {
  component: Actions,
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
    data: {
      actions: [
        {
          name: 'change_param',
          plugin: '',
          parameter: '',
          value: '',
        },
        {
          name: 'mint_tokens',
          wallets: [
            {
              address: '',
              amount: '0',
            },
          ],
        },
        {
          name: 'withdraw_assets',
          recipient: '',
          tokenAddress: '',
          tokenDecimals: '18',
          amount: 0,
          daoAddress: '',
          tokenType: TokenType.NATIVE,
        },
        {
          name: 'merge_pr',
          url: '',
        },
      ],
    },
  },
  decorators: [FormProviderDecorator],
};

export const Empty: Story = {
  args: { data: { actions: [] } },
  decorators: [FormProviderDecorator],
};
