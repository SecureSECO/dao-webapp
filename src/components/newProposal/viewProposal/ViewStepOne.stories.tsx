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

export const RichHtml: Story = {
  args: {
    data: {
      title: 'A nice title for a proposal with a rich description',
      summary: 'This is a proposal ',
      description:
        '<p>This is richt text content</p><p><strong>This line is bold</strong></p><p><em>This is in italics</em></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.example.com">This is a link</a></p><ul><li><p>We even have lists</p></li><li><p>With multiple elements</p></li><li><p>This one is numbered</p></li></ul><p>But we can also have bullet point lists</p><ol><li><p>Bullet 1</p></li><li><p>Bullet 2</p></li><li><p>Last bullet 3</p></li></ol><p></p>',
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
