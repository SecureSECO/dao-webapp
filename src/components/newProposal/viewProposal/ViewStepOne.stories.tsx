import type { Meta, StoryObj } from '@storybook/react';

import { ViewStepOne } from './ViewStepOne';

const meta: Meta<typeof ViewStepOne> = {
  component: ViewStepOne,
};

export default meta;
type Story = StoryObj<typeof ViewStepOne>;

export const Primary: Story = {
  args: {
    data: {
      title: 'A nice title for a nice proposal',
      summary: 'This is a proposal to empty the DAO treasury',
      description:
        'I wish to empty the DAO treasury for my own personal gains. \nI would greatly appreciate it if you would be so kind as to vote "yes" for this proposal',
      resources: [
        { name: 'Example resource 1', url: 'https:://www.example.com/1' },
        { name: 'Example resource 2', url: 'https:://www.example.com/2' },
      ],
      media: {
        logo: '',
        header: '',
      },
    },
  },
};

export const Undefined: Story = {
  args: {
    data: undefined,
  },
};
