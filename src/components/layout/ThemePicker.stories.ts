import ThemePicker from '@/src/components/layout/ThemePicker';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: ThemePicker,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
