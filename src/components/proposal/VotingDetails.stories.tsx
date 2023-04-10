/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import VotingDetails from '@/src/components/proposal/VotingDetails';
import { dummyProposal } from '@/src/hooks/useProposal';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: VotingDetails,
  tags: ['autodocs'],
  argTypes: {
    proposal: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof VotingDetails>;

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
    proposal: dummyProposal,
  },
};
