import Header from '@/src/components/ui/Header';
import { Panel } from '@/src/components/ui/Panel';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Panel',
  component: Panel,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    children: <Header>Panel</Header>,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    padding: 'lg',
    children: <Header>Panel</Header>,
  },
};
