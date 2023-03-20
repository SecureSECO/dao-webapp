import { Button } from '@/src/components/ui/Button';
import type { Meta, StoryObj } from '@storybook/react';

import { MainCard } from '@/src/components/ui/MainCard';
import { HiInbox } from 'react-icons/hi2';

const meta: Meta<typeof MainCard> = {
  component: MainCard,
  argTypes: {
    aside: {
      table: {
        disable: true,
      },
    },
    header: {
      table: {
        disable: true,
      },
    },
    icon: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainCard>;

export const Primary: Story = {
  args: {
    icon: HiInbox,
    header: <p className="text-xl">Example title</p>,
    aside: (
      <Button
        label="Click me!"
        onClick={() => console.log('I have been clicked!')}
      />
    ),
  },
};
