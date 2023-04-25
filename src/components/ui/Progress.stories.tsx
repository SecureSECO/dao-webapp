/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from '@/src/components/ui/Progress';

const meta: Meta<typeof Progress> = {
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Primary: Story = {
  args: {
    value: 33,
  },
};

export const ZeroProggress: Story = {
  args: {
    value: 0,
  },
};

export const Done: Story = {
  args: {
    value: 100,
  },
};

export const AlmostDone: Story = {
  args: {
    value: 99,
  },
};

export const Small: Story = {
  args: {
    value: 33,
    size: 'sm',
  },
};
