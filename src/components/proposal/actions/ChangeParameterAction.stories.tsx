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
import { dummyChangeParamsAction } from '@/src/hooks/useProposal';

const meta: Meta<typeof ChangeParameterAction> = {
  component: ChangeParameterAction,
  argTypes: {
    action: {
      table: {
        disable: true,
      },
    },
    asChild: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChangeParameterAction>;

export const Primary: Story = {
  args: {
    value: 'first',
    action: dummyChangeParamsAction,
  },
  decorators: [
    (Story) => (
      <Accordion type="single" collapsible>
        <Story />
      </Accordion>
    ),
  ],
};
