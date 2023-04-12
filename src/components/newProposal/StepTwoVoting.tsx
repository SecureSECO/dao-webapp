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
} from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { Input } from '@/src/components/ui/Input';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { StepTwoData } from './newProposalData';
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
        <StartTime
          register={register}
          getValues={getValues}
          control={control}
        />
        <EndTime register={register} getValues={getValues} control={control} />
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
    <fieldset>
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
            <RadioButtonCard id="yes-no-abstain" value={value} />
          </RadioGroup>
        )}
      />
    </fieldset>
  );
};
export interface RadioButtonCardProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  error?: FieldError;
  id: string;
  value: 'yes-no-abstain';
}

const RadioButtonCard = React.forwardRef<HTMLDivElement, RadioButtonCardProps>(
  ({ className, id, error, value, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-slate-50 dark:focus:ring-offset-slate-800',
          error
            ? 'border-red-600 focus:ring-red-600 dark:border-red-700 dark:focus:ring-red-700'
            : value == 'yes-no-abstain'
            ? 'border-2 border-primary-500 ring-primary-700 dark:border-primary-400 dark:ring-primary-600'
            : 'border-slate-300 focus:ring-slate-400 dark:border-slate-700 dark:focus:ring-slate-400',

          className
        )}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={id} id={id} className="group" />

          <h2>
            Yes, no, or abstain (Members can vote for, against, or abstain)
          </h2>
        </div>
      </div>
    );
  }
);
RadioButtonCard.displayName = 'RadioButtonCard';

export const StartTime = ({
  register,
  getValues,
  control,
}: {
  register: UseFormRegister<StepTwoData>;
  getValues: UseFormGetValues<StepTwoData>;
  control: Control<StepTwoData, any>;
}) => {
  return (
    <fieldset>
      <legend>Start time</legend>
      <Controller
        control={control}
        name="start_time_type"
        defaultValue={'now'}
        render={({ field: { onChange, name } }) => (
          <RadioGroup onChange={onChange} defaultValue={'now'} name={name}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="start-now" />
              <h2>Now</h2>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="start-custom" />
              <h2>Custom</h2>
            </div>
          </RadioGroup>
        )}
      />
      {getValues('start_time_type') === 'custom' && (
        <Input
          {...register('start_time')}
          type="datetime-local"
          placeholder="Start time"
        />
      )}
    </fieldset>
  );
};

export const EndTime = ({
  register,
  getValues,
  control,
}: {
  register: UseFormRegister<StepTwoData>;
  getValues: UseFormGetValues<StepTwoData>;
  control: Control<StepTwoData, any>;
}) => {
  return (
    <fieldset>
      <legend>End time</legend>
      <Controller
        control={control}
        name="end_time_type"
        defaultValue={'duration'}
        render={({ field: { name, onChange } }) => (
          <RadioGroup defaultValue={'duration'} onChange={onChange} name={name}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="duration"
                id="end-duration"
                className="group"
              />
              <h2>Duration</h2>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="end-custom" />
              <h2>Custom</h2>
            </div>
          </RadioGroup>
        )}
      />
      {getValues('end_time_type') === 'duration' ? (
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
        getValues('end_time_type') === 'custom' && (
          <input
            {...register('end_time')}
            type="datetime-local"
            placeholder="End time"
            min={getValues('start_time')}
          />
        )
      )}
    </fieldset>
  );
};
