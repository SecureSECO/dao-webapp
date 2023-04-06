import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';
import Check from '../icons/Check';
import Activity from '../icons/Actitivy';
import { HiOutlineClock, HiXMark } from 'react-icons/hi2';

const meta = {
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    icon: Activity,
    size: 'md',
    text: 'Active',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    icon: HiOutlineClock,
    size: 'md',
    text: 'Pending',
  },
};

export const Green: Story = {
  args: {
    variant: 'green',
    icon: Check,
    size: 'md',
    text: 'Succeeded',
  },
};

export const Red: Story = {
  args: {
    variant: 'red',
    icon: HiXMark,
    size: 'md',
    text: 'Defeated',
  },
};
