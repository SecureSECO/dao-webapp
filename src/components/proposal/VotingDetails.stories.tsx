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
