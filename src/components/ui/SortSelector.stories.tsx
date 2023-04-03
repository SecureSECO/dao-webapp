import type { Meta, StoryObj } from '@storybook/react';
import SortSelector from '@/src/components/ui/SortSelector';

const meta = {
  component: SortSelector,
  tags: ['autodocs'],
  argTypes: {
    setSortBy: {
      table: {
        disable: true,
      },
    },
    setDirection: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof SortSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    setSortBy: () => {},
    setDirection: () => {},
  },
};
