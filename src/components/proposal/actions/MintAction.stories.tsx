/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MintAction from '@/src/components/proposal/actions/MintAction';
import { Accordion } from '@/src/components/ui/Accordion';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: MintAction,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof MintAction>;

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
      method: 'mint',
      interface: 'IMint',
      params: {
        to: [
          {
            to: '0xD42B4BA7E532E3947FB1829C22EAA7DE754D79A8',
            amount: 1000000000000000000n,
            tokenId: 0n,
          },
          {
            to: '0xD6E6C74C6054AD232C7A9833E89714EA39734A0F',
            amount: 1000000000000000000n,
            tokenId: 0n,
          },
        ],
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
