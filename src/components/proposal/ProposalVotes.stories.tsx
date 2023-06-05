/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ProposalVotes from '@/src/components/proposal/ProposalVotes';
import { dummyProposal, dummyVotes } from '@/src/hooks/useProposal';
import { Proposal, ProposalStatus } from '@plopmenz/diamond-governance-sdk';
import type { Meta, StoryObj } from '@storybook/react';
import { BigNumber } from 'ethers';

const meta = {
  component: ProposalVotes,
  tags: ['autodocs'],
  argTypes: {
    proposal: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ProposalVotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    proposal: dummyProposal,
    votes: dummyVotes,
    loading: false,
    totalVotingWeight: BigNumber.from('0x8AC7230489E80000'),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};

export const Pending: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Pending,
    } as Proposal,
    votes: dummyVotes,
    loading: false,
    totalVotingWeight: BigNumber.from('0x8AC7230489E80000'),
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
    votes: dummyVotes,
    loading: false,
    totalVotingWeight: BigNumber.from('0x8AC7230489E80000'),
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
    votes: dummyVotes,
    loading: false,
    totalVotingWeight: BigNumber.from('0x8AC7230489E80000'),
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
    votes: dummyVotes,
    loading: false,
    totalVotingWeight: BigNumber.from('0x8AC7230489E80000'),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};

export const Loading: Story = {
  args: {
    proposal: dummyProposal,
    votes: dummyVotes,
    loading: true,
    totalVotingWeight: BigNumber.from('0x8AC7230489E80000'),
    canVote: {
      Yes: true,
      No: true,
      Abstain: true,
    },
  },
};
