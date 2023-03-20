import { Button } from '@/src/components/ui/Button';
import type { Meta, StoryObj } from '@storybook/react';

import { HeaderCard } from './HeaderCard';

const meta: Meta<typeof HeaderCard> = {
  component: HeaderCard,
  argTypes: {
    aside: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderCard>;

export const Primary: Story = {
  args: {
    title: 'Example title',
    aside: (
      <Button
        label="Click me!"
        onClick={() => console.log('I have been clicked!')}
      />
    ),
  },
};
