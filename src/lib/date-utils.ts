/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Utility functions for dates.
 * mainly used for step 2 of the new proposal form.
 */

import { add, format, isBefore, parse } from 'date-fns';

//Today's date in yyyy-MM-dd format for the default value and minimum valuable in the forms later.
export function getTodayDateString() {
  return format(new Date(), 'yyyy-MM-dd');
}

// Returns the date in yyyy-MM-dd format that is durationSeconds seconds ahead of the startDate, or now if startDate is not provided.
export function getDurationDateAhead(
  durationSeconds: number,
  startDate?: string
) {
  const today = new Date(startDate ?? getTodayDateString());
  const durationAhead = add(today, { seconds: durationSeconds });
  return format(durationAhead, 'yyyy-MM-dd');
}

// returns the time in string format that is 10 minutes ahead of the current time. (for some leadway while someone is filling out the form)
export function getTimeIn10Minutes(): string {
  return format(getTimeInxMinutesAsDate(10), 'HH:mm');
}

export function getTimeInxMinutesAsDate(x: number): Date {
  return add(new Date(), { minutes: x });
}

/**
 * @param date The date in yyyy-MM-dd format
 * @param time The time in HH:mm format
 * @param timezone The timezone string in the format "UTC±HH:mm"
 * @returns  The date as a Date object in the format "yyyy-MM-dd'T'HH:mm:ssxxx"
 */
export function inputToDate(
  date: string,
  time: string,
  timezone: string
): Date {
  const { sign, hours, minutes } = timezoneStringFormat(timezone);
  const iso8601Timezone = `${sign}${hours.padStart(2, '0')}:${
    minutes ? minutes : '00'
  }`;

  // Combine date, time, and timezone into a single string
  const combinedDateTime = `${date}T${time}:00${iso8601Timezone}`;

  // Parse the combined string into a Date object
  const parsedDateTime = parse(
    combinedDateTime,
    "yyyy-MM-dd'T'HH:mm:ssxxx",
    new Date()
  );

  return parsedDateTime;
}

/**
 *
 * @param timezone The timezone string in the format "UTC±HH:mm"
 * @returns The timezone string in the format { sign: string, hours: string, minutes: string}
 */
export function timezoneStringFormat(timezone: string) {
  // Convert the timezone string from "UTC±HH:mm" format to "±HH:mm" format
  const timezoneOffsetPattern = /UTC\s?([+-])(\d{1,2})(?::(\d{2}))?/;
  const matched = timezone.match(timezoneOffsetPattern);

  if (!matched) {
    throw new Error('Invalid timezone in function');
  }

  const [, sign, hours, minutes] = matched;

  return {
    sign,
    hours,
    minutes,
  };
}

/**
 * @param timezone1 The timezone string in the format "UTC±HH:mm"
 * @param timezone2 The timezone string in the format "UTC±HH:mm"
 * @returns The difference in minutes between the two timezones
 */
export function timezoneOffsetDifference(
  timezone1: string,
  timezone2: string
): number {
  const timezone1Components = timezoneStringFormat(timezone1);
  const timezone2Components = timezoneStringFormat(timezone2);

  const timezone1OffsetMinutes =
    parseInt(timezone1Components.hours) * 60 +
    parseInt(timezone1Components.minutes || '0');
  const timezone2OffsetMinutes =
    parseInt(timezone2Components.hours) * 60 +
    parseInt(timezone2Components.minutes || '0');

  const sign1 = timezone1Components.sign === '-' ? -1 : 1;
  const sign2 = timezone2Components.sign === '-' ? -1 : 1;

  return sign1 * timezone1OffsetMinutes - sign2 * timezone2OffsetMinutes;
}

/**
 * @param startDate The start date in the format "yyyy-MM-dd"
 * @param startTime The start time in the format "HH:mm"
 * @param endDate The end date in the format "yyyy-MM-dd"
 * @param endTime The end time in the format "HH:mm"
 * @param minDurationSeconds The minimum duration in seconds
 * @returns Whether the gap between the start and end date is at least minDurationSeconds seconds (boolean)
 */
export function isGapEnough(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  minDurationSeconds: number
): boolean {
  const startDateTime = new Date(`${startDate}T${startTime}:00`);
  const endDateTime = new Date(`${endDate}T${endTime}:00`);
  const minEndDateTime = add(startDateTime, { seconds: minDurationSeconds });

  return !isBefore(endDateTime, minEndDateTime);
}

/**
 * @function getUserTimezone
 * @description Get the user's timezone as a string
 */
export function getUserTimezone(): string {
  // Get the current timezone offset in minutes
  const timezoneOffset = new Date().getTimezoneOffset();

  // Calculate the hours and minutes from the offset
  const hours = Math.floor(Math.abs(timezoneOffset) / 60);
  const minutes = Math.abs(timezoneOffset) % 60;

  // Determine the sign (UTC+ or UTC-)
  const sign = timezoneOffset <= 0 ? '+' : '-';

  // Convert the hours and minutes to a string
  const hoursString = hours.toString();

  // Check if the offset is a whole hour and format accordingly
  const timezoneString =
    minutes === 0
      ? `UTC${sign}${hoursString}`
      : `UTC${sign}${hoursString}:${minutes.toString().padStart(2, '0')}`;

  return timezoneString;
}
