/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useForm,
  useWatch,
} from 'react-hook-form';
import { RadioButtonCard, RadioGroup } from '@/src/components/ui/RadioGroup';
import { LabelledInput } from '@/src/components/ui/Input';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { Card } from '@/src/components/ui/Card';
import { TimezoneSelector } from '@/src/components/ui/TimeZoneSelector';
import { useVotingSettings } from '@/src/hooks/useVotingSettings';
import { add, format, isToday } from 'date-fns';
import {
  getDurationDateAhead,
  getTimeIn10Minutes,
  getTodayDateString,
  getUserTimezone,
  inputToDate,
  isGapEnough,
  timezoneOffsetDifference,
} from '@/src/lib/date-utils';
import { Label } from '@/src/components/ui/Label';
import Legend from '@/src/components/ui/Legend';

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

  const { settings, error } = useVotingSettings({});

  if (error) console.error('Voting settings fetching error', error);

  const {
    register,
    getValues,
    handleSubmit,
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
        settings ? settings.minDuration : 24 * 60 * 60
      ),
      custom_end_time: getTimeIn10Minutes(),
      custom_end_timezone: getUserTimezone(),
    },
  });

  const onSubmit = (data: ProposalFormVotingSettings) => {
    console.log(data);
    setStep(3);
    setDataStep2(data);
    // Handle submission
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
          <Card variant="light" className="flex gap-2">
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
            <div className="w-full">
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
  const { settings, error } = useVotingSettings({});
  if (error) console.error('Voting settings fetching error', error);

  //initialize minEndDate and minEndTime
  let minEndDate = undefined;
  let minEndTime = undefined;

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
        (settings ? settings.minDuration * 1000 : 24 * 60 * 60 * 1000)
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

    minEndTime = format(minEndDateTimeWithOffset, 'HH:mm');
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
          <Card variant="light" className="flex gap-2">
            <LabelledInput
              id="duration_days"
              type="number"
              label="Days"
              {...register('duration_days', { required: true })}
              min={
                //calculates the minimum hours, rounded down, based on the minimum duration
                settings ? Math.floor(settings.minDuration / 60 / 60 / 24) : 1
              }
              max="364"
              error={errors.duration_days}
              className="text-center"
            />
            <LabelledInput
              id="duration_hours"
              type="number"
              label="Hours"
              {...register('duration_hours', { required: true })}
              min={
                settings
                  ? //calculates the minimum hours, rounded down, based on the minimum duration
                    Math.floor(
                      (settings.minDuration % (60 * 60 * 24)) / 60 / 60
                    )
                  : 0
              }
              max="23"
              error={errors.duration_hours}
              className="text-center"
            />
            <LabelledInput
              id="duration_minutes"
              type="number"
              label="Minutes"
              {...register('duration_minutes', { required: true })}
              min={
                settings
                  ? //calculates the minimum minutes, rounded up, based on the minimum duration
                    Math.ceil(
                      ((settings.minDuration % (60 * 60 * 24)) % (60 * 60)) / 60
                    )
                  : 0
              }
              max="59"
              error={errors.duration_minutes}
              className="text-center"
            />
          </Card>
        ) : (
          endTimeType === 'end-custom' && (
            <Card variant="light" className="flex gap-2">
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
                type="time"
                label="Time"
                {...register('custom_end_time', { required: true })}
                min={
                  //if the user has selected a custom start time, calculate the minimum end time.
                  // If they don't they get a required error.
                  startDate &&
                  startTime &&
                  minEndTime &&
                  minEndDate &&
                  //this is done so you don't need to have a minimum time if it is weeks apart
                  isGapEnough(
                    //if the gap between the start and end time is big enough, set the min time to 00:00
                    startDate,
                    startTime,
                    minEndDate,
                    minEndTime,
                    settings ? settings.minDuration : 24 * 60 * 60
                  )
                    ? '00:00'
                    : minEndTime //else if the gap is not big enough, set the min time to the minEndTime
                }
                error={errors.custom_end_time}
              />
              <div className="w-full">
                <Label htmlFor="custom_end_timezone">Timezone</Label>
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
