/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NewProposalFormProvider } from '@/src/pages/NewProposal';
import type { Meta, StoryObj } from '@storybook/react';
import {
  StepOneMetadata,
  StepThreeData,
  StepTwoData,
} from '../newProposalData';

import { Confirmation } from './Confirmation';

const meta: Meta<typeof Confirmation> = {
  component: Confirmation,
};

export default meta;
type Story = StoryObj<typeof Confirmation>;

const FormProviderDecoratorFactory = (
  data1: StepOneMetadata | undefined,
  data2: StepTwoData | undefined,
  data3: StepThreeData | undefined
): any => {
  // eslint-disable-next-line react/display-name
  return (Story: any) => (
    <NewProposalFormProvider
      step={4}
      dataStep1={data1}
      dataStep2={data2}
      dataStep3={data3}
    >
      <Story />
    </NewProposalFormProvider>
  );
};

export const Primary: Story = {
  decorators: [
    FormProviderDecoratorFactory(
      {
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
      {
        option: 'yes-no-abstain',
        start_time_type: 'now',
        end_time_type: 'duration',
        duration_minutes: 30,
        duration_hours: 3,
        duration_days: 1,
      },
      {
        actions: [
          {
            name: 'mint_tokens',
            wallets: [
              { address: '0x123', amount: 1 },
              { address: '0x098765432123456789', amount: 3.141 },
              { address: '0x765656565656566566', amount: 1000 },
            ],
          },
          {
            name: 'withdraw_assets',
            recipient: '0x123456',
            tokenAddress: '0x987654321',
            amount: '3.141',
          },
        ],
      }
    ),
  ],
};

export const Empty: Story = {
  decorators: [FormProviderDecoratorFactory(undefined, undefined, undefined)],
};
