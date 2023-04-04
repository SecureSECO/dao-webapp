import type { Meta, StoryObj } from '@storybook/react';
import ProposalCard from '@/src/components/governance/ProposalCard';
import { ProposalStatus, TokenType } from '@aragon/sdk-client';
import { addDays, subDays } from 'date-fns';
import { StatusBadge } from './StatusBadge';

const meta = {
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// type StatusVariant =
//   | 'Pending'
//   | 'Active'
//   | 'Succeeded'
//   | 'Executed'
//   | 'Defeated'
//   | 'Verified'
//   | 'Expired'
//   | 'Unverified';

export const Pending: Story = {
  args: {
    status: 'Pending',
  },
};

export const Active: Story = {
  args: {
    status: 'Active',
  },
};

export const Succeeded: Story = {
  args: {
    status: 'Succeeded',
  },
};

export const Executed: Story = {
  args: {
    status: 'Executed',
  },
};

export const Defeated: Story = {
  args: {
    status: 'Defeated',
  },
};

export const Verified: Story = {
  args: {
    status: 'Verified',
  },
};

export const Expired: Story = {
  args: {
    status: 'Expired',
  },
};

export const Unverified: Story = {
  args: {
    status: 'Unverified',
  },
};
