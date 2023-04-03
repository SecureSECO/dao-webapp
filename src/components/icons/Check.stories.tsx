import type { Meta, StoryObj } from '@storybook/react';
import Check from '@/src/components/icons/Check';

const meta = {
  component: Check,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Check>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-5 h-5',
  },
};
