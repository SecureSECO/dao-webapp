/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ProposalHistory from '@/src/components/proposal/ProposalHistory';
import { dummyProposal } from '@/src/hooks/useProposal';
import {
  Proposal,
  ProposalStatus,
} from '@secureseco-dao/diamond-governance-sdk';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: ProposalHistory,
  tags: ['autodocs'],
  argTypes: {
    proposal: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ProposalHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    proposal: dummyProposal,
    loading: false,
  },
};

export const Pending: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Pending,
    } as Proposal,
    loading: false,
  },
};

export const Succeeded: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Succeeded,
    } as Proposal,
    loading: false,
  },
};

export const Executed: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Executed,
    } as Proposal,
    loading: false,
  },
};

export const Defeated: Story = {
  args: {
    proposal: {
      ...dummyProposal,
      status: ProposalStatus.Defeated,
    } as Proposal,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    proposal: dummyProposal,
    loading: true,
  },
};
