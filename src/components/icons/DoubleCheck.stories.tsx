import type { Meta, StoryObj } from '@storybook/react';
import DoubleCheck from '@/src/components/icons/DoubleCheck';

const meta = {
  component: DoubleCheck,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DoubleCheck>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-5 h-5',
  },
};
