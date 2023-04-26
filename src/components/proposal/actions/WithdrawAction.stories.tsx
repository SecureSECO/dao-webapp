/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import WithdrawAction from '@/src/components/proposal/actions/WithdrawAction';
import { Accordion } from '@/src/components/ui/Accordion';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: WithdrawAction,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof WithdrawAction>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const Default: Story = {
  args: {
    value: 'first',
    action: {
      method: 'withdraw',
      interface: 'IWithdraw',
      params: {
        to: '0xD42B4BA7E532E3947FB1829C22EAA7DE754D79A8',
        amount: 1000000000000000000n,
        tokenAddress: '0x0000000000000000000000000000000000000000',
      },
    },
  },
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible>
        <Story />
      </Accordion>
    ),
  ],
};

export const UnknownToken: Story = {
  args: {
    value: 'first',
    action: {
      method: 'withdraw',
      interface: 'IWithdraw',
      params: {
        to: '0xD42B4BA7E532E3947FB1829C22EAA7DE754D79A8',
        amount: 1000000000000000000n,
        tokenAddress: '0x2222222222222222222222222222222222222222',
      },
    },
  },
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible>
        <Story />
      </Accordion>
    ),
  ],
};
