/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Meta, StoryObj } from '@storybook/react';

import { ViewStepTwo } from './ViewStepTwo';

const meta: Meta<typeof ViewStepTwo> = {
  component: ViewStepTwo,
};

export default meta;
type Story = StoryObj<typeof ViewStepTwo>;

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
};

export const CustomDates: Story = {
  args: {
    data: {
      option: 'yes-no-abstain',
      start_time_type: 'custom',
      end_time_type: 'custom',
      start_time: new Date(2024, 11, 15, 8, 18),
      end_time: new Date(2025, 0, 15, 6, 30),
    },
  },
};

export const Undefined: Story = {
  args: {
    data: undefined,
  },
};
