import DAI from '@/src/components/icons/DAI';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: DAI,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof DAI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-5 h-5',
  },
};
