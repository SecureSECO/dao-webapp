/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { ProposalResources } from '@/src/components/proposal/ProposalResources';

const meta: Meta<typeof ProposalResources> = {
  component: ProposalResources,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProposalResources>;

export const Primary: Story = {
  args: {
    loading: false,
    resources: [
      {
        name: 'Resource 1',
        url: 'https://www.example.com/1',
      },
      {
        name: 'Resource 2',
        url: 'https://www.example.com/2',
      },
    ],
  },
};

export const NoResources: Story = {
  args: {
    loading: false,
    resources: [],
  },
};
