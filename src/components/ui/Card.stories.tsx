/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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