/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import CategoryList from '@/src/components/ui/CategoryList';

const meta = {
  component: CategoryList,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof CategoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

const categories = [
  {
    title: 'Decision rules',
    items: [
      {
        label: 'Support threshold',
        value: `50%`,
      },
      {
        label: 'Minimum participation',
        value: `15%`,
      },
    ],
  },
  {
    title: 'Voting activity',
    items: [
      {
        label: 'Current participation',
        value: `14%`,
      },
      {
        label: 'Unique voters',
        value: '5',
      },
    ],
  },
  {
    title: 'Voting period',
    items: [
      {
        label: 'Start',
        value: '04/17/2023, 1:50 PM',
      },
      {
        label: 'End',
        value: '04/18/2023, 2:00 PM',
      },
    ],
  },
];

export const Primary: Story = {
  args: {
    categories,
  },
};

export const NoDividers: Story = {
  args: {
    categories,
    showDivider: false,
  },
};

export const LargeTitle: Story = {
  args: {
    categories,
    titleSize: 'lg',
  },
};
