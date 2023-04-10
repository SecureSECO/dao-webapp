/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  component: Progress,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Primary: Story = {
  render: () => <Progress value={33} />,
};

export const ZeroProggress: Story = {
  render: () => <Progress value={0} />,
};

export const Done: Story = {
  render: () => <Progress value={100} />,
};

export const AlmostDone: Story = {
  render: () => <Progress value={99} />,
};