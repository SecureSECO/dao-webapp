import type { Meta, StoryObj } from '@storybook/react';

import TokenAmount from './TokenAmount';

const meta: Meta<typeof TokenAmount> = {
  component: TokenAmount,
};

export default meta;
type Story = StoryObj<typeof TokenAmount>;

export const Primary: Story = {
  render: () => (
    <TokenAmount amount={1234556789n} tokenDecimals={6} symbol="TEST" />
  ),
};
