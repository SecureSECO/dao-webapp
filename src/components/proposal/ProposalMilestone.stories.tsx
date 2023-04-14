/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';
import ProposalMilestone from '@/src/components/proposal/ProposalMilestone';

const meta = {
  component: ProposalMilestone,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ProposalMilestone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Done: Story = {
  args: {
    label: 'Published',
    blockNumber: 123456,
    variant: 'loading',
    date: addDays(new Date(), -1),
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};
