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
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
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
import { RadioGroupItemProps } from '@radix-ui/react-radio-group';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { TimezoneSelector } from '@/src/components/ui/TimeZoneSelector';

export const StepTwo = () => {
  const { setStep, dataStep2, setDataStep2 } = useNewProposalFormContext();

  const {
    register,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StepTwoData>({ defaultValues: dataStep2 });

  const onSubmit = (data: StepTwoData) => {
    console.log(data);
    setStep(3);
    setDataStep2(data);
    // Handle submission
  };

  const handleBack = () => {
    const data = getValues();
    setDataStep2(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <VotingOption register={register} control={control} />
        <StartTime register={register} control={control} errors={errors} />
        <EndTime register={register} control={control} errors={errors} />
      </div>
      <StepNavigator onBack={handleBack} />
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

interface RadioButtonCardProps<T extends string> extends RadioGroupItemProps {
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
          <RadioGroupItem value={id} id={id} className="group" {...props} />
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
  errors,
}: {
  register: UseFormRegister<StepTwoData>;
  control: Control<StepTwoData, any>;
  errors: FieldErrors<StepTwoData>;
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
          <Card className="flex w-full gap-2 bg-slate-50 dark:bg-slate-700/50">
            <LabelledInput
              id="custom_start_date"
              type="date"
              label="Date"
              {...register('custom_start_date')}
              min={new Date().toISOString().split('T')[0]}
              error={errors.custom_start_date}
            />
            <LabelledInput
              id="custom_start_time"
              type="time"
              label="Time"
              {...register('custom_start_time')}
              min={new Date().toISOString().slice(11, 16)}
              error={errors.custom_start_time}
            />
            <div className="w-full">
              <label htmlFor="custom_start_timezone">Timezone</label>
              <TimezoneSelector
                id="custom_start_timezone"
                control={control}
                error={errors.custom_start_timezone}
                name="custom_start_timezone"
              />
            </div>
          </Card>
        )}
      </div>
    </fieldset>
  );
};

export const EndTime = ({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<StepTwoData>;
  control: Control<StepTwoData, any>;
  errors: FieldErrors<StepTwoData>;
}) => {
  const endTimeType = useWatch({
    control,
    name: 'end_time_type',
    defaultValue: 'duration',
  });

  const startTimeType = useWatch({
    control,
    name: 'start_time_type',
    defaultValue: 'now',
  });

  const startDate = useWatch({
    control,
    name: 'custom_start_date',
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
                title="Duration"
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
          <Card className="flex w-full gap-2 bg-slate-50 dark:bg-slate-700/50">
            <LabelledInput
              id="duration_minutes"
              type="number"
              label="Minutes"
              {...register('duration_minutes')}
              min="0"
              max="59"
              defaultValue={0}
              error={errors.duration_minutes}
            />
            <LabelledInput
              id="duration_hours"
              type="number"
              label="Hours"
              {...register('duration_hours')}
              min="0"
              max="23"
              defaultValue={0}
              error={errors.duration_hours}
            />
            <LabelledInput
              id="duration_days"
              type="number"
              label="Days"
              {...register('duration_days')}
              min="2"
              max="364"
              defaultValue={2}
              error={errors.duration_days}
            />
          </Card>
        ) : (
          endTimeType === 'end-custom' && (
            <Card className="flex w-full gap-2 bg-slate-50 dark:bg-slate-700/50">
              <LabelledInput
                id="custom_end_date"
                type="date"
                label="Date"
                {...register('custom_end_date', { required: true })}
                min={new Date().toISOString()}
                error={errors.custom_end_date}
              />
              <LabelledInput
                id="custom_end_time"
                type="time"
                label="Time"
                {...register('custom_end_time', { required: true })}
                min={new Date().toISOString()}
                error={errors.custom_end_time}
              />
              <div className="w-full">
                <label htmlFor="custom_end_timezone">Timezone</label>
                <TimezoneSelector
                  id={'custom_end_timezone'}
                  control={control}
                  error={errors.custom_end_timezone}
                  name="custom_end_timezone"
                />
              </div>
            </Card>
          )
        )}
      </div>
    </fieldset>
  );
};

export interface LabelledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: FieldError;
}

const LabelledInput = React.forwardRef<HTMLInputElement, LabelledInputProps>(
  ({ id, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={id}>{label}</label>
        <ErrorWrapper name={label} error={error}>
          <Input
            ref={ref}
            id={id}
            error={error}
            placeholder={label}
            {...props}
            className="w-full text-center"
          />
        </ErrorWrapper>
      </div>
    );
  }
);

LabelledInput.displayName = 'LabelledInput';

export default LabelledInput;
