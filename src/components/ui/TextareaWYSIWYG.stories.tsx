import type { Meta, StoryObj } from '@storybook/react';

import { TextareaWYSIWYG } from './TextareaWYSIWYG';

const meta: Meta<typeof TextareaWYSIWYG> = {
  component: TextareaWYSIWYG,
};

export default meta;
type Story = StoryObj<typeof TextareaWYSIWYG>;

export const Primary: Story = {
  render: () => (
    <TextareaWYSIWYG
      setError={() => console.log('error')}
      clearErrors={() => console.log('clear errors')}
    />
  ),
};
