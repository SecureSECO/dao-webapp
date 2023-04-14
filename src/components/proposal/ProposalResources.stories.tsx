import type { Meta, StoryObj } from '@storybook/react';

import { ProposalResources } from './ProposalResources';

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
