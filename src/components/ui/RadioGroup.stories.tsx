import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

import { RadioGroup, RadioGroupItem } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {
  render: () => (
    <RadioGroup defaultValue="2">
      <RadioGroupItem value="1" />
      <RadioGroupItem value="2" />
      <RadioGroupItem value="3" />
    </RadioGroup>
  ),
};
