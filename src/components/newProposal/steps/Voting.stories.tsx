/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { NewProposalFormProvider } from '@/src/pages/NewProposal';

import { Voting } from './Voting';

const meta: Meta<typeof Voting> = {
  component: Voting,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Voting>;

const FormProviderDecorator = (Story: any, options: any) => {
  const { args } = options;

  return (
    <NewProposalFormProvider step={2} dataStep2={args.data}>
      <Story />
    </NewProposalFormProvider>
  );
};

export const Primary: Story = {
  args: {
    data: {
      option: 'yes-no-abstain',
      start_time_type: 'now',
      end_time_type: 'duration',
      duration_minutes: 30,
      duration_hours: 3,
      duration_days: 1,
    },
  },
  decorators: [FormProviderDecorator],
};

export const CustomStartTime: Story = {
  args: {
    data: {
      option: 'yes-no-abstain',
      start_time_type: 'custom',
      custom_start_date: '2345-01-23',
      custom_start_time: '12:34',
      custom_start_timezone: 'UTC+1',
      end_time_type: 'duration',
      duration_minutes: 30,
      duration_hours: 3,
      duration_days: 1,
    },
  },
  decorators: [FormProviderDecorator],
};

export const BothCustomTime: Story = {
  args: {
    data: {
      option: 'yes-no-abstain',
      start_time_type: 'custom',
      custom_start_date: '2345-01-23',
      custom_start_time: '12:34',
      custom_start_timezone: 'UTC+1',
      end_time_type: 'end-custom',
      custom_end_date: '2400-01-23',
      custom_end_time: '15:15',
      custom_end_timezone: 'UTC+2',
    },
  },
  decorators: [FormProviderDecorator],
};
