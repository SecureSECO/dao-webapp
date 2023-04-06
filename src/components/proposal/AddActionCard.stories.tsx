import type { Meta, StoryObj } from '@storybook/react';

import { AddActionCard } from './AddProposalAction';

const meta: Meta<typeof AddActionCard> = {
  component: AddActionCard,
};

export default meta;
type Story = StoryObj<typeof AddActionCard>;

export const Primary: Story = {
  render: () => <AddActionCard append={() => console.log('Adding actiong')} />,
};
