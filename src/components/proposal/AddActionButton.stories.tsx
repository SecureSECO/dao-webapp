import type { Meta, StoryObj } from '@storybook/react';

import { AddActionButton } from './AddProposalAction';

const meta: Meta<typeof AddActionButton> = {
  component: AddActionButton,
};

export default meta;
type Story = StoryObj<typeof AddActionButton>;

export const Primary: Story = {
  render: () => <AddActionButton append={() => {}} />,
};
