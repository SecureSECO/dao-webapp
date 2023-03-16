import Header from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Card,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    children: <Header>Card</Header>,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    padding: 'lg',
    children: <Header>Card</Header>,
  },
};
