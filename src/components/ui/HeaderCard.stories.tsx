import type { Meta, StoryObj } from '@storybook/react';

import { HeaderCard } from './HeaderCard';

const meta: Meta<typeof HeaderCard> = {
  component: HeaderCard,
};

export default meta;
type Story = StoryObj<typeof HeaderCard>;

export const Primary: Story = {
  args: {
    title: 'Example title',
    btnLabel: 'Click me!',
    btnOnClick: () => console.log('you clicked me!'),
  },
};
