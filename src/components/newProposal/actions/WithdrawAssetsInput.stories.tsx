/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { withProposalAction } from '@/src/lib/decorators/proposalActionDecorator';
import type { Meta, StoryObj } from '@storybook/react';

import { WithdrawAssetsInput } from './WithdrawAssetsInput';

const meta: Meta<typeof WithdrawAssetsInput> = {
  component: WithdrawAssetsInput,
};

export default meta;

type Story = StoryObj<typeof WithdrawAssetsInput>;

export const Primary: Story = {
  parameters: {
    defaultValues: {
      actions: [
        {
          name: 'withdraw_assets',
          recipient: '0x123456789012345678901234567890',
          tokenAddress: 'custom',
          tokenAddressCustom: '0x99999999999999999999999',
          amount: 3.21,
        },
      ],
    },
  },
  decorators: [withProposalAction],
};
