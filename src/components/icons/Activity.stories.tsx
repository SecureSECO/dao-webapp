import type { Meta, StoryObj } from '@storybook/react';
import Activity from '@/src/components/icons/Actitivy';

const meta = {
  component: Activity,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Activity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-5 h-5',
  },
};
