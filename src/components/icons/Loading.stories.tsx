import type { Meta, StoryObj } from '@storybook/react';
import Loading from '@/src/components/icons/Loading';

const meta = {
  component: Loading,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-5 h-5',
  },
};
