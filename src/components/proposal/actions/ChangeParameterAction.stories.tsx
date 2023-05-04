/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../../ui/Accordion';

import { ChangeParameterAction } from './ChangeParameterAction';

const meta: Meta<typeof ChangeParameterAction> = {
  component: ChangeParameterAction,
};

export default meta;
type Story = StoryObj<typeof ChangeParameterAction>;

export const Primary: Story = {
  args: {
    value: 'first',
    action: {
      method: 'changeParam',
      interface: 'IChangeParam',
      params: {
        plugin: 'A plugin',
        parameter: 'parameter 1',
        value: '3.14159',
      },
    },
  },
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible>
        <Story />
      </Accordion>
    ),
  ],
};
