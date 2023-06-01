/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Rep from '@/src/components/icons/Rep';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Rep,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Rep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-5 h-5',
  },
};
