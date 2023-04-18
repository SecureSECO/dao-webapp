/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Meta, StoryObj } from '@storybook/react';

import { ViewStepTwo } from './ViewStepTwo';
import {
  getDurationDateAhead,
  getTimeIn10Minutes,
  getTodayDateString,
  getUserTimezone,
} from '@/src/lib/date-utils';

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
      //Defaut values for when the user first opens the form.
      option: 'yes-no-abstain',
      start_time_type: 'custom',
      end_time_type: 'duration',
      custom_start_time: getTimeIn10Minutes(),
      custom_start_date: getTodayDateString(),
      custom_start_timezone: getUserTimezone(),
      duration_days: 7,
      duration_hours: 0,
      duration_minutes: 0,
      custom_end_date: getDurationDateAhead(24 * 60 * 60),
      custom_end_time: getTimeIn10Minutes(),
      custom_end_timezone: getUserTimezone(),
    },
  },
};

export const Undefined: Story = {
  args: {
    data: undefined,
  },
};
