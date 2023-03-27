import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

import { Label } from './Label';

const meta: Meta<typeof Label> = {
  component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Primary: Story = {
  render: () => (
    <div>
      <Input id="test" />
      <Label for="test">This is a label for the input above</Label>
    </div>
  ),
};
