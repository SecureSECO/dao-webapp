/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { HeaderCard } from '../../ui/HeaderCard';
import { StepTwoData } from '../newProposalData';
import { add, format } from 'date-fns';
import { isNullOrUndefined } from '@/src/lib/utils';
import { inputToDate } from '@/src/lib/date-utils';

export const ViewStepTwo = ({ data }: { data: StepTwoData | undefined }) => {
  if (!data)
    return (
      <HeaderCard title="Voting">
        <p>The voting data is not available. </p>
      </HeaderCard>
    );

  const categories = getCategories(data);
  return (
    <HeaderCard variant="light" title="Voting">
      {categories.map((category) => (
        <div key={category.title}>
          <div className="flex flex-row items-center gap-x-2">
            <p className="font-medium dark:text-slate-300">{category.title}</p>
            <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          {category.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-row justify-between gap-x-2"
            >
              <p className="text-gray-500 dark:text-slate-400">{item.label}</p>
              <p className="text-primary-300 dark:text-primary-400">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ))}
    </HeaderCard>
  );
};

/**
 * Gets data to be used to render by ViewStepTwo. The data summerizes the voting options and timing.
 * @param data The StepTwoData
 * @returns A JSON object for summarizing step two data
 */
const getCategories = (data: StepTwoData) => [
  {
    title: 'Decision rules',
    items: [
      {
        label: 'Voting Option',
        value: data.option,
      },
    ],
  },
  {
    title: 'Voting Period',
    items: [
      {
        label: 'Start',
        value: getStartDate(data),
      },
      {
        label: 'end',
        value: getEndDate(data),
      },
    ],
  },
];

/**
 * @param data The StepTwoData
 * @returns A string to display the start date
 */
function getStartDate(data: StepTwoData): string {
  if (data.start_time_type == 'now') return 'now';
  if (
    data.custom_start_date &&
    data.custom_start_time &&
    data.custom_start_timezone
  ) {
    return format(
      inputToDate(
        data.custom_start_date,
        data.custom_start_time,
        data.custom_start_timezone
      ),
      'Pp'
    );
  }
  return 'N/A';
}

/**
 * @param data The StepTwoData
 * @returns A string to display the end date
 */
function getEndDate(data: StepTwoData): string {
  if (
    data.end_time_type == 'end-custom' &&
    data.custom_end_date &&
    data.custom_end_time &&
    data.custom_end_timezone
  ) {
    return format(
      inputToDate(
        data.custom_end_date,
        data.custom_end_time,
        data.custom_end_timezone
      ),
      'Pp'
    );
  } else if (
    (data.end_time_type == 'end-custom' &&
      isNullOrUndefined(data.custom_end_date)) ||
    isNullOrUndefined(data.custom_end_time) ||
    isNullOrUndefined(data.custom_end_timezone)
  ) {
    return 'N/A';
  }

  const now = new Date();
  const duration = {
    days: data.duration_days,
    hours: data.duration_hours,
    minutes: data.duration_minutes,
  };
  const end_time = add(now, duration);
  return format(end_time, 'Pp');
}
