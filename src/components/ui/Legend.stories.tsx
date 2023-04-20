/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import Legend from '@/src/components/ui/Legend';

const meta: Meta<typeof Legend> = {
  tags: ['autodocs'],
  component: Legend,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Legend>;

export const Primary: Story = {
  args: {
    children: 'This is a legend element',
  },
  decorators: [
    (Story) => (
      <fieldset>
        <Story />
      </fieldset>
    ),
  ],
};
