/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SortSelector from '@/src/components/ui/SortSelector';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: SortSelector,
  tags: ['autodocs'],
  argTypes: {
    setOrder: {
      table: {
        disable: true,
      },
    },
    setSorting: {
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
    setSorting: () => {},
    setOrder: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex flex-row gap-x-2">
        <Story />
      </div>
    ),
  ],
};
