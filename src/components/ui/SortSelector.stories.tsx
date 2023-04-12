/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
  decorators: [
    (Story) => (
      <div className="flex flex-row gap-x-2">
        <Story />
      </div>
    ),
  ],
};
