/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { ViewStepThree } from './ViewStepThree';
import { emptyMintTokenForm, emptyWithdrawForm } from '../newProposalData';

const meta: Meta<typeof ViewStepThree> = {
  component: ViewStepThree,
};

export default meta;
type Story = StoryObj<typeof ViewStepThree>;

export const EmptyActions: Story = {
  args: {
    data: {
      actions: [emptyMintTokenForm, emptyWithdrawForm],
    },
  },
};

export const MintTokens: Story = {
  args: {
    data: {
      actions: [
        {
          name: 'mint_tokens',
          wallets: [
            { address: '0x123', amount: 1 },
            { address: '0x098765432123456789', amount: 3.141 },
            { address: '0x765656565656566566', amount: 1000 },
          ],
        },
      ],
    },
  },
};

export const WithdrawAssets: Story = {
  args: {
    data: {
      actions: [
        {
          name: 'withdraw_assets',
          recipient: '0x123456',
          tokenAddress: '0x987654321',
          amount: '3.141',
        },
      ],
    },
  },
};

export const Undefined: Story = {
  args: {
    data: undefined,
  },
};

export const Primary: Story = {
  args: {
    data: {
      actions: [
        ...(MintTokens.args?.data?.actions ?? []),
        ...(WithdrawAssets.args?.data?.actions ?? []),
      ],
    },
  },
};
