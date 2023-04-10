/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

import { RadioGroup, RadioGroupItem } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {
  render: () => (
    <RadioGroup defaultValue="2">
      <RadioGroupItem value="1" />
      <RadioGroupItem value="2" />
      <RadioGroupItem value="3" />
    </RadioGroup>
  ),
};