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

export const ViewStepTwo = ({
  data,
}: {
  data: StepTwoData | undefined;
}): React.ReactNode => {
  if (!data)
    return (
      <HeaderCard title="Voting">
        <p>The voting data is not available. </p>
      </HeaderCard>
    );

  const categories = getCategories(data);
  return (
    <HeaderCard title="Voting">
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

function getStartDate(data: StepTwoData) {
  if (data.start_time_type == 'now') return 'now';
  if (isNullOrUndefined(data.start_time)) return 'N/A';
  return format(new Date(data.start_time!), 'Pp');
}

function getEndDate(data: StepTwoData) {
  if (data.end_time_type == 'custom' && isNullOrUndefined(data.end_time))
    return 'N/A';
  if (data.end_time_type == 'custom')
    return format(new Date(data.end_time!), 'Pp');

  const now = new Date();
  const duration = {
    days: data.duration_days,
    hours: data.duration_hours,
    minutes: data.duration_minutes,
  };
  const end_time = add(now, duration);
  return format(end_time, 'Pp');
}
