/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import React from 'react';

import { Label } from './Label';

const meta: Meta<typeof Label> = {
  component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Primary: Story = {
  render: () => (
    <div>
      <Input id="test" />
      <Label htmlFor="test">This is a label for the input above</Label>
    </div>
  ),
};