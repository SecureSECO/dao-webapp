/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { NewProposalFormProvider } from '@/src/pages/NewProposal';
import type { Meta, StoryObj } from '@storybook/react';

import { Metadata } from './Metadata';

const meta: Meta<typeof Metadata> = {
  component: Metadata,
};

export default meta;
type Story = StoryObj<typeof Metadata>;

const FormProviderDecorator = (Story: any, options: any) => {
  const { args } = options;

  return (
    <NewProposalFormProvider step={1} dataStep1={args.data}>
      <Story />
    </NewProposalFormProvider>
  );
};

export const Primary: Story = {
  args: {
    data: {
      title: 'A nice title for a proposal with a rich description',
      summary: 'This is a proposal ',
      description:
        '<p>This is richt text content</p><p><strong>This line is bold</strong></p><p><em>This is in italics</em></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="http://www.example.com">This is a link</a></p><ol><li><p>We even have lists</p></li><li><p>With multiple elements</p></li><li><p>This one is numbered</p></li></ol><p>But we can also have bullet point lists</p><ul><li><p>Bullet 1</p></li><li><p>Bullet 2</p></li><li><p>Last bullet 3</p></li></ul><p></p>',
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
  decorators: [FormProviderDecorator],
};
