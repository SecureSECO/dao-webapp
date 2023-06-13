/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { LabelledInput } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import Legend from '@/src/components/ui/Legend';
import { RadioButtonCard, RadioGroup } from '@/src/components/ui/RadioGroup';
import { TimezoneSelector } from '@/src/components/ui/TimeZoneSelector';
import { usePartialVotingProposalMinDuration } from '@/src/hooks/useFacetFetch';
import { IsEmptyOrOnlyWhitespace, cn } from '@/src/lib/utils';
import {
  getDurationDateAhead,
  getDurationInSeconds,
  getTimeIn10Minutes,
  getTodayDateString,
  getUserTimezone,
  inputToDate,
  timezoneOffsetDifference,
} from '@/src/lib/utils/date';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import {
  add,
  format,
  formatDuration,
  intervalToDuration,
  isToday,
} from 'date-fns';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useForm,
  useWatch,
} from 'react-hook-form';

export type ProposalFormVotingSettings = {
  option: VoteOption;
  start_time_type: StartTimeType;
  end_time_type: EndTimeType;
  duration_minutes?: number;
  duration_hours?: number;
  duration_days?: number;
  custom_end_date?: string;
  custom_end_time?: string;
  custom_end_timezone?: string;
  custom_start_date?: string;
  custom_start_time?: string;
  custom_start_timezone?: string;
};

export type VoteOption = 'yes-no-abstain';
export type StartTimeType = 'now' | 'custom';
export type EndTimeType = 'duration' | 'end-custom';

export const Voting = () => {
  const { setStep, dataStep2, setDataStep2 } = useNewProposalFormContext();

  const { data: minDuration, error } = usePartialVotingProposalMinDuration();

  if (error) console.error('Voting settings fetching error', error);

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<ProposalFormVotingSettings>({
    defaultValues: dataStep2 ?? {
      //Defaut values for when the user first opens the form.
      option: 'yes-no-abstain',
      start_time_type: 'now',
      end_time_type: 'duration',
      custom_start_time: getTimeIn10Minutes(),
      custom_start_date: getTodayDateString(),
      custom_start_timezone: getUserTimezone(),
      duration_days: 7,
      duration_hours: 0,
      duration_minutes: 0,
      custom_end_date: getDurationDateAhead(
        minDuration !== null ? minDuration : 24 * 60 * 60
      ),
      custom_end_time: getTimeIn10Minutes(),
      custom_end_timezone: getUserTimezone(),
    },
  });

  const onSubmit = (data: ProposalFormVotingSettings) => {
    const duration_too_low = durationTooLow(data, minDuration);
    if (duration_too_low) {
      setError('root.durationTooLow', {
        type: 'custom',
        message: duration_too_low,
      });
      return;
    }

    const end_time_too_soon = endTimeTooSoon(data, minDuration);
    if (end_time_too_soon) {
      setError('root.endTooSoon', {
        type: 'custom',
        message: end_time_too_soon,
      });
      return;
    }

    setStep(3);
    setDataStep2(data);
  };

  //rember the values of the inputs when the user clicks back, so it can be used when the user clicks next again.
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

/**
 *
 * @param control control from react-hook-form
 * @returns a component with all the voting options (currently only yes/no/abstain)
 */
export const VotingOption = ({
  control,
}: {
  register: UseFormRegister<ProposalFormVotingSettings>;
  control: Control<ProposalFormVotingSettings, any>;
}) => {
  return (
    <fieldset className="space-y-1">
      <Legend>Options</Legend>
      <Controller
        control={control}
        name="option"
        render={({ field: { onChange, name, value } }) => (
          <RadioGroup onChange={onChange} defaultValue={value} name={name}>
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

export const StartTime = ({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<ProposalFormVotingSettings>;
  control: Control<ProposalFormVotingSettings, any>;
  errors: FieldErrors<ProposalFormVotingSettings>;
}) => {
  //watch the start time type so that the custom start time input can be hidden when the user selects "now"
  const { startTimeType, startDate } = getWatchers(control);

  return (
    <fieldset className="space-y-1">
      <Legend>Start time</Legend>
      <div className=" space-y-2">
        <Controller
          control={control}
          name="start_time_type"
          render={({ field: { onChange, name, value } }) => (
            <RadioGroup
              onChange={onChange}
              defaultValue={value}
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
          <Card variant="light" className="flex flex-col sm:flex-row gap-2">
            <LabelledInput
              id="custom_start_date"
              type="date"
              label="Date"
              {...register('custom_start_date', { required: true })}
              min={getTodayDateString()} //the minimum date is today, cannot start in the past
              error={errors.custom_start_date}
            />
            <LabelledInput
              id="custom_start_time"
              type="time"
              label="Time"
              {...register('custom_start_time', { required: true })}
              min={
                isToday(new Date(startDate!)) ? getTimeIn10Minutes() : '00:00'
              } //the minimum time is now (+10 minutes, so you have some more time to fill in the form, get), cannot start in the past
              error={errors.custom_start_time}
            />
            <div className="w-full space-y-1">
              <Label htmlFor="custom_start_timezone">Timezone</Label>
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
  register: UseFormRegister<ProposalFormVotingSettings>;
  control: Control<ProposalFormVotingSettings, any>;
  errors: FieldErrors<ProposalFormVotingSettings>;
}) => {
  // getWatchers for minEndDate and minEndTime calculations (and also max)
  const {
    endTimeType,
    startTimeType,
    startDate,
    startTime,
    startTimezone,
    endTimezone,
  } = getWatchers(control);

  //retrieve settings for the minDuration
  const { data: minDuration } = usePartialVotingProposalMinDuration();

  //initialize minEndDate and minEndTime
  let minEndDate = undefined;

  if (startDate && startTime && startTimezone && endTimezone) {
    //if the user has selected a custom start time, calculate the minimum end time. If they don't they get a required error.
    const now = new Date();

    //check if the date is custom or not. If it is, use the custom date, if not, use now.
    const startDateTime =
      startTimeType === 'custom'
        ? inputToDate(startDate!, startTime!, startTimezone!)
        : now;

    //add the duration on top of the startTime
    const minEndDateTime = new Date(
      startDateTime.getTime() +
        (minDuration !== null ? minDuration * 1000 : 24 * 60 * 60 * 1000)
    );

    //Convert the minEndDateTime to the selected endTimezone
    const userTimezone = 'UTC' + format(new Date(), 'xxx'); // Get the user's timezone offset in ±HH:mm format
    const totalOffsetMinutes = timezoneOffsetDifference(
      userTimezone,
      endTimezone!
    );

    const minEndDateTimeWithOffset = add(minEndDateTime, {
      minutes: -totalOffsetMinutes,
    });

    minEndDate = format(minEndDateTimeWithOffset, 'yyyy-MM-dd');
  }

  return (
    <fieldset className="space-y-1">
      <Legend>End time</Legend>
      <div className="space-y-2">
        <Controller
          control={control}
          name="end_time_type"
          render={({ field: { name, onChange, value } }) => (
            <RadioGroup
              defaultValue={value}
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
          <ErrorWrapper
            error={errors?.root?.durationTooLow as any}
            name="Duration too low"
          >
            <Card
              variant="light"
              className={cn(
                'flex gap-2',
                errors?.root?.durationTooLow &&
                  'border-2 border-destructive focus:ring-destructive'
              )}
            >
              <LabelledInput
                id="duration_days"
                type="number"
                label="Days"
                {...register('duration_days', { required: true })}
                min="0"
                max="364"
                error={errors.duration_days}
                className="text-center"
              />
              <LabelledInput
                id="duration_hours"
                type="number"
                label="Hours"
                {...register('duration_hours', { required: true })}
                min="0"
                max="23"
                error={errors.duration_hours}
                className="text-center"
              />
              <LabelledInput
                id="duration_minutes"
                type="number"
                label="Minutes"
                {...register('duration_minutes', { required: true })}
                min="0"
                max="59"
                error={errors.duration_minutes}
                className="text-center"
              />
            </Card>
          </ErrorWrapper>
        ) : (
          endTimeType === 'end-custom' && (
            <ErrorWrapper
              name="Duration between start and end too short"
              error={errors?.root?.endTooSoon as any}
            >
              <Card
                variant="light"
                className={cn(
                  'flex flex-col sm:flex-row gap-2',
                  errors?.root?.durationTooLow &&
                    'border-2 border-destructive focus:ring-destructive'
                )}
              >
                <LabelledInput
                  id="custom_end_date"
                  type="date"
                  label="Date"
                  {...register('custom_end_date', { required: true })}
                  min={minEndDate}
                  error={errors.custom_end_date}
                  max={getDurationDateAhead(364 * 24 * 60 * 60, minEndDate)} //max 364 days ahead
                />
                <LabelledInput
                  id="custom_end_time"
                  {...register('custom_end_time', {
                    validate: {
                      required: (v, fv) =>
                        fv.end_time_type !== 'end-custom' ||
                        (v !== undefined && !IsEmptyOrOnlyWhitespace(v)) ||
                        'Time is required',
                    },
                  })}
                  type="time"
                  label="Time"
                  error={errors.custom_end_time}
                />
                <div className="w-full space-y-1">
                  <Label htmlFor="custom_end_timezone">Timezone</Label>
                  <TimezoneSelector
                    id={'custom_end_timezone'}
                    control={control}
                    error={errors.custom_end_timezone}
                    name="custom_end_timezone"
                  />
                </div>
              </Card>
            </ErrorWrapper>
          )
        )}
      </div>
    </fieldset>
  );
};

function getWatchers(control: Control<ProposalFormVotingSettings, any>) {
  const endTimeType = useWatch({
    control,
    name: 'end_time_type',
  });

  const startTimeType = useWatch({
    control,
    name: 'start_time_type',
  });

  const startDate = useWatch({
    control,
    name: 'custom_start_date',
  });

  const endDate = useWatch({
    control,
    name: 'custom_end_date',
  });

  const startTime = useWatch({
    control,
    name: 'custom_start_time',
  });

  const endTime = useWatch({
    control,
    name: 'custom_end_time',
  });

  const startTimezone = useWatch({
    control,
    name: 'custom_start_timezone',
  });

  const endTimezone = useWatch({
    control,
    name: 'custom_end_timezone',
  });

  return {
    endTimeType,
    startTimeType,
    startDate,
    endDate,
    startTime,
    endTime,
    startTimezone,
    endTimezone,
  };
}

const durationTooLow = (
  data: ProposalFormVotingSettings,
  minDuration: number | null
): false | string => {
  // If it is not a duration end type, no majority voting setting is known, or if duration data is not defined.
  // Then the duration is not too low.
  if (
    data.end_time_type !== 'duration' ||
    minDuration === null ||
    data.duration_days === undefined ||
    data.duration_hours === undefined ||
    data.duration_minutes === undefined
  ) {
    return false;
  }
  const duration = getDurationInSeconds(
    data.duration_days,
    data.duration_hours,
    data.duration_minutes
  );
  // Duration is not too low if it is larger or equal to the minimum duration.
  if (duration >= minDuration) {
    return false;
  }

  // Duration is too low, return a formated duration message.

  const minDur = formatDuration(
    intervalToDuration({
      start: 0,
      end: (minDuration ?? 0) * 1000,
    })
  );
  const msg = `Duration should be at least ${minDur}`;

  return msg;
};

const endTimeTooSoon = (
  data: ProposalFormVotingSettings,
  minDuration: number | null
): false | string => {
  // If it is not a custom end type, no majority voting setting is known, or if duration data is not defined.
  // Then the end time is not too soon.
  if (
    data.end_time_type !== 'end-custom' ||
    minDuration === null ||
    data.custom_end_date === undefined ||
    data.custom_end_time === undefined ||
    data.custom_end_timezone === undefined ||
    data.custom_start_date === undefined ||
    data.custom_start_time === undefined ||
    data.custom_start_timezone === undefined
  ) {
    return false;
  }

  const start =
    data.start_time_type === 'now'
      ? new Date()
      : inputToDate(
          data.custom_start_date,
          data.custom_start_time,
          data.custom_start_timezone
        );
  const end = inputToDate(
    data.custom_end_date,
    data.custom_end_time,
    data.custom_end_timezone
  );

  const durationAsSeconds = (end.getTime() - start.getTime()) / 1000;

  // Duration is not too low if it is larger or equal to the minimum duration.
  if (durationAsSeconds >= minDuration) {
    return false;
  }

  // Duration is too low, return a formated end date message.
  const minDur = formatDuration(
    intervalToDuration({
      start: 0,
      end: (minDuration ?? 0) * 1000,
    })
  );
  const msg = `The time between the start end end should be at least ${minDur}`;

  return msg;
};
