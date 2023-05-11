/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import VotesContent from '@/src/components/proposal/VotesContent';
import { dummyProposal } from '@/src/hooks/useProposal';
import { Proposal, ProposalStatus } from '@plopmenz/diamond-governance-sdk';
import type { Meta, StoryObj } from '@storybook/react';
import { BigNumber } from 'ethers';

const meta = {
  component: VotesContent,
  tags: ['autodocs'],
  argTypes: {
    proposal: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof VotesContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const Active: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Active,
    } as Proposal,
    totalVotingWeight: BigNumber.from(5),
    votingPower: BigNumber.from(1),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};

export const ActiveCannotVote: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Active,
    } as Proposal,
    totalVotingWeight: BigNumber.from(5),
    votingPower: BigNumber.from(1),
    canVote: {
      Yes: false,
      No: false,
      Abstain: false,
    },
  },
};

export const Pending: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Pending,
    } as Proposal,
    totalVotingWeight: BigNumber.from(5),
    votingPower: BigNumber.from(1),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};

export const Succeeded: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Succeeded,
    } as Proposal,
    totalVotingWeight: BigNumber.from(5),
    votingPower: BigNumber.from(1),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};

export const Executed: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Executed,
    } as Proposal,
    totalVotingWeight: BigNumber.from(5),
    votingPower: BigNumber.from(1),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};

export const Defeated: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Defeated,
    } as Proposal,
    totalVotingWeight: BigNumber.from(5),
    votingPower: BigNumber.from(1),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};
