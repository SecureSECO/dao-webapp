import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    label: 'Button',
    disabled: false,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    label: 'Button',
    disabled: false,
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    label: 'Button',
    disabled: false,
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    label: 'Button',
    disabled: false,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Button',
    disabled: false,
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    label: 'Button',
    disabled: false,
  },
};
