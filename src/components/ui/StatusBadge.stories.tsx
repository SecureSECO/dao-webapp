import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta = {
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

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
