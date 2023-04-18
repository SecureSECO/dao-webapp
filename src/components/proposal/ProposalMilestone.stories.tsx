/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import ProposalMilestone from '@/src/components/proposal/ProposalMilestone';

const meta = {
  component: ProposalMilestone,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ProposalMilestone>;

export default meta;
type Story = StoryObj<typeof meta>;

const decorator = (Story: any) => (
  <div className="w-96">
    <Story />
  </div>
);

export const Done: Story = {
  args: {
    label: 'Published',
    blockNumber: 8283818,
    variant: 'done',
    date: new Date(),
  },
  decorators: [decorator],
};

export const NoBlockNumber: Story = {
  args: {
    label: 'Published',
    variant: 'done',
    date: new Date(),
  },
  decorators: [decorator],
};

export const NoDate: Story = {
  args: {
    label: 'Published',
    variant: 'done',
  },
  decorators: [decorator],
};

export const Loading: Story = {
  args: {
    label: 'Running',
    variant: 'loading',
    date: new Date(),
  },
  decorators: [decorator],
};

export const Failed: Story = {
  args: {
    label: 'Defeated',
    variant: 'failed',
    date: new Date(),
  },
  decorators: [decorator],
};

export const Executed: Story = {
  args: {
    label: 'Executed',
    variant: 'executed',
    date: new Date(),
  },
  decorators: [decorator],
};
