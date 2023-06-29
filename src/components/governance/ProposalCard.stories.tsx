/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ProposalCard from '@/src/components/governance/ProposalCard';
import {
  dummyChangeParamsAction,
  dummyMergeAction,
  dummyMintAction,
  dummyProposal,
  dummyWithdrawActions,
} from '@/src/hooks/useProposal';
import {
  Proposal,
  ProposalStatus,
} from '@secureseco-dao/diamond-governance-sdk';
import type { Meta, StoryObj } from '@storybook/react';
import { add, sub } from 'date-fns';

const meta = {
  component: ProposalCard,
  tags: ['autodocs'],
  argTypes: {
    proposal: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ProposalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Pending,
      startDate: add(new Date(), { days: 1 }),
      endDate: add(new Date(), { days: 2 }),
    } as Proposal,
  },
};

export const Active: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Active,
      startDate: sub(new Date(), { days: 1 }),
      endDate: add(new Date(), { days: 1 }),
    } as Proposal,
  },
};

export const Succeeded: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Succeeded,
      startDate: sub(new Date(), { days: 2 }),
      endDate: sub(new Date(), { days: 1 }),
    } as Proposal,
  },
};

export const Defeated: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Defeated,
      startDate: sub(new Date(), { days: 2 }),
      endDate: sub(new Date(), { days: 1 }),
    } as Proposal,
  },
};

export const Executed: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Executed,
      startDate: sub(new Date(), { days: 2 }),
      endDate: sub(new Date(), { days: 1 }),
    } as Proposal,
  },
};

export const WithActions: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Succeeded,
      startDate: sub(new Date(), { days: 2 }),
      endDate: sub(new Date(), { days: 1 }),
      actions: [
        dummyMintAction,
        ...dummyWithdrawActions,
        dummyChangeParamsAction,
        dummyMergeAction,
      ],
    } as any as Proposal,
  },
};
