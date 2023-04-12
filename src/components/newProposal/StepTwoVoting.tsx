/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  UseFormGetValues,
  UseFormRegister,
  useForm,
  useWatch,
} from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { Input } from '@/src/components/ui/Input';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import {
  EndTimeType,
  StartTimeType,
  StepTwoData,
  VoteOption,
} from './newProposalData';
import { Card } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';

export const StepTwo = () => {
  const { setStep } = useNewProposalFormContext();

  const { register, getValues, handleSubmit, control } = useForm<StepTwoData>();

  const onSubmit = (data: StepTwoData) => {
    console.log(data);
    setStep(3);
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <VotingOption register={register} control={control} />
        <StartTime register={register} control={control} />
        <EndTime register={register} control={control} />
      </div>
      <StepNavigator />
    </form>
  );
};

export const VotingOption = ({
  control,
}: {
  register: UseFormRegister<StepTwoData>;
  control: Control<StepTwoData, any>;
}) => {
  return (
    <fieldset className="space-y-1">
      <legend>Options</legend>
      <Controller
        control={control}
        name="option"
        defaultValue={'yes-no-abstain'}
        render={({ field: { onChange, name, value } }) => (
          <RadioGroup
            onChange={onChange}
            defaultValue={'yes-no-abstain'}
            name={name}
          >
            <RadioButtonCard<VoteOption>
              id="yes-no-abstain"
              value={value}
              title="Yes, no, or abstain"
              description="Members can vote for, against, or abstain"
            />
          </RadioGroup>
        )}
      />
    </fieldset>
  );
};

interface RadioButtonCardProps<T extends string>
  extends React.InputHTMLAttributes<HTMLDivElement> {
  error?: FieldError;
  id: T;
  value: T;
  title: string;
  description?: string;
}

function RadioButtonCard<T extends string>({
  className,
  id,
  error,
  value,
  description,
  title,
  ...props
}: RadioButtonCardProps<T>) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex w-full cursor-pointer rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-offset-slate-800',
        error
          ? 'border-red-600 focus:ring-red-600 dark:border-red-700 dark:focus:ring-red-700'
          : value === id && 'ring-2 ring-primary-500 dark:ring-primary-400 ',
        className
      )}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <span className="text-base text-slate-700 dark:text-slate-300">
            {title}
          </span>
          <RadioGroupItem value={id} id={id} className="group" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </label>
  );
}

RadioButtonCard.displayName = 'RadioButtonCard';

export const StartTime = ({
  register,
  control,
}: {
  register: UseFormRegister<StepTwoData>;
  control: Control<StepTwoData, any>;
}) => {
  const startTimeType = useWatch({
    control,
    name: 'start_time_type',
    defaultValue: 'now',
  });

  return (
    <fieldset className="space-y-1">
      <legend>Start time</legend>
      <div className=" space-y-2">
        <Controller
          control={control}
          name="start_time_type"
          defaultValue={'now'}
          render={({ field: { onChange, name, value } }) => (
            <RadioGroup
              onChange={onChange}
              defaultValue={'now'}
              name={name}
              className="flex gap-x-2"
            >
              <RadioButtonCard<StartTimeType>
                title="Now"
                id={'now'}
                value={value}
              />
              <RadioButtonCard<StartTimeType>
                title="Custom"
                id={'custom'}
                value={value}
              />
            </RadioGroup>
          )}
        />
        {startTimeType === 'custom' && (
          <Input
            {...register('start_time')}
            type="datetime-local"
            placeholder="Start time"
            className="text-white"
          />
        )}
      </div>
    </fieldset>
  );
};

export const EndTime = ({
  register,
  control,
}: {
  register: UseFormRegister<StepTwoData>;
  control: Control<StepTwoData, any>;
}) => {
  const endTimeType = useWatch({
    control,
    name: 'end_time_type',
    defaultValue: 'duration',
  });

  const startTime = useWatch({
    control,
    name: 'start_time',
    defaultValue: '',
  });

  return (
    <fieldset className="space-y-1">
      <legend>End time</legend>
      <div className="space-y-2">
        <Controller
          control={control}
          name="end_time_type"
          defaultValue={'duration'}
          render={({ field: { name, onChange, value } }) => (
            <RadioGroup
              defaultValue={'duration'}
              onChange={onChange}
              name={name}
              className="flex gap-x-2"
            >
              <RadioButtonCard<EndTimeType>
                title="Now"
                id={'duration'}
                value={value}
              />
              <RadioButtonCard<EndTimeType>
                title="Custom"
                id={'end-custom'}
                value={value}
              />
            </RadioGroup>
          )}
        />

        {endTimeType === 'duration' ? (
          <div className="data-[state=checked] flex gap-2">
            <Input
              {...register('duration_minutes')}
              type="number"
              placeholder="Minutes"
              min="0"
              max="525600" // 365 days in minutes
            />
            <Input
              {...register('duration_hours')}
              type="number"
              placeholder="Hours"
              min="0"
              max="8760" // 365 days in hours
            />
            <Input
              {...register('duration_days')}
              type="number"
              placeholder="Days"
              min="0"
              max="365"
            />
          </div>
        ) : (
          endTimeType === 'end-custom' && (
            <Input
              {...register('end_time')}
              type="datetime-local"
              placeholder="End time"
              min={startTime}
            />
          )
        )}
      </div>
    </fieldset>
  );
};
