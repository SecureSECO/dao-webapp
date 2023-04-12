/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ProposalCard from '@/src/components/governance/ProposalCard';
import { ProposalStatus, TokenType } from '@aragon/sdk-client';
import { addDays, subDays } from 'date-fns';

const meta = {
  component: ProposalCard,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ProposalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const Pending: Story = {
  args: {
    proposal: {
      id: '0x22345',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal',
        summary: 'Test Proposal Summary',
      },
      startDate: addDays(new Date(), 2),
      endDate: addDays(new Date(), 5),
      status: ProposalStatus.PENDING,
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
        type: TokenType.ERC20,
      },
      result: {
        yes: 100000n,
        no: 0n,
        abstain: 0n,
      },
      settings: {
        supportThreshold: 0.5,
        duration: 87000,
        minParticipation: 0.15,
      },
      totalVotingWeight: 1000000000000000000n,
    },
  },
};

export const Active: Story = {
  args: {
    proposal: {
      id: '0x22345',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal',
        summary: 'Test Proposal Summary',
      },
      startDate: addDays(new Date(), 2),
      endDate: addDays(new Date(), 5),
      status: ProposalStatus.ACTIVE,
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
        type: TokenType.ERC20,
      },
      result: {
        yes: 100000n,
        no: 0n,
        abstain: 0n,
      },
      settings: {
        supportThreshold: 0.5,
        duration: 87000,
        minParticipation: 0.15,
      },
      totalVotingWeight: 1000000000000000000n,
    },
  },
};

export const Succeeded: Story = {
  args: {
    proposal: {
      id: '0x22345',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal',
        summary: 'Test Proposal Summary',
      },
      startDate: subDays(new Date(), 5),
      endDate: subDays(new Date(), 2),
      status: ProposalStatus.SUCCEEDED,
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
        type: TokenType.ERC20,
      },
      result: {
        yes: 100000n,
        no: 0n,
        abstain: 0n,
      },
      settings: {
        supportThreshold: 0.5,
        duration: 87000,
        minParticipation: 0.15,
      },
      totalVotingWeight: 1000000000000000000n,
    },
  },
};

export const Defeated: Story = {
  args: {
    proposal: {
      id: '0x22345',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal',
        summary: 'Test Proposal Summary',
      },
      startDate: subDays(new Date(), 5),
      endDate: subDays(new Date(), 2),
      status: ProposalStatus.DEFEATED,
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
        type: TokenType.ERC20,
      },
      result: {
        yes: 100000n,
        no: 0n,
        abstain: 0n,
      },
      settings: {
        supportThreshold: 0.5,
        duration: 87000,
        minParticipation: 0.15,
      },
      totalVotingWeight: 1000000000000000000n,
    },
  },
};

export const Executed: Story = {
  args: {
    proposal: {
      id: '0x22345',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal',
        summary: 'Test Proposal Summary',
      },
      startDate: subDays(new Date(), 5),
      endDate: subDays(new Date(), 2),
      status: ProposalStatus.EXECUTED,
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
        type: TokenType.ERC20,
      },
      result: {
        yes: 100000n,
        no: 0n,
        abstain: 0n,
      },
      settings: {
        supportThreshold: 0.5,
        duration: 87000,
        minParticipation: 0.15,
      },
      totalVotingWeight: 1000000000000000000n,
    },
  },
};
