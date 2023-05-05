/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import TokenAmount from '@/src/components/ui/TokenAmount';

const meta: Meta<typeof TokenAmount> = {
  component: TokenAmount,
};

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default meta;
type Story = StoryObj<typeof TokenAmount>;

export const Primary: Story = {
  args: {
    amount: 1234556789n,
    tokenDecimals: 6,
    symbol: 'TEST',
  },
};

export const LowAmount: Story = {
  args: {
    amount: 1234556789n,
    tokenDecimals: 14,
    symbol: 'TEST',
  },
};

export const HighAmount: Story = {
  args: {
    amount: 3123456789123456789n,
    tokenDecimals: 8,
    symbol: 'TEST',
  },
};

export const TooHighAmount: Story = {
  args: {
    amount: 3123456789123456789789123n,
    tokenDecimals: 8,
    symbol: 'TEST',
  },
};

export const NftAmount: Story = {
  args: {
    amount: 1n,
    tokenDecimals: 0,
    symbol: 'The NFT',
  },
};
