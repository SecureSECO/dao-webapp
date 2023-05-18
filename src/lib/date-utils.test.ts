/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  countdownText,
  getDurationDateAhead,
  getDurationInSeconds,
  inputToDate,
  isGapEnough,
  timezoneOffsetDifference,
  timezoneStringFormat,
} from '@/src/lib/date-utils';
import { addDays, addHours, addMinutes, addSeconds } from 'date-fns';

test("'2022-12-15' + 1 day (=86400 secs) to be 2022-12-16", () => {
  expect(getDurationDateAhead(86400, '2022-12-15')).toBe('2022-12-16');
});

test("'2022-12-15 12:34 UTC+04:00' parses correctly'", () => {
  expect(inputToDate('2022-12-15', '12:34', 'UTC+04:00')).toEqual(
    new Date('2022-12-15T12:34:00.000+04:00')
  );
});

test("timezoneStringFormat parses 'UTC-12:34' correctly", () => {
  expect(timezoneStringFormat('UTC-12:34')).toEqual({
    sign: '-',
    hours: '12',
    minutes: '34',
  });
  expect(timezoneStringFormat('UTC+12:34')).toEqual({
    sign: '+',
    hours: '12',
    minutes: '34',
  });
});

test('timezoneOffsetDifference is correct for various options', () => {
  expect(timezoneOffsetDifference('UTC+00:10', 'UTC+00:10')).toBe(0);
  expect(timezoneOffsetDifference('UTC-00:10', 'UTC+00:10')).toBe(-20);
  expect(timezoneOffsetDifference('UTC-00:00', 'UTC+00:00')).toEqual(-0);
  expect(timezoneOffsetDifference('UTC+00:00', 'UTC-00:00')).toEqual(0);
  expect(timezoneOffsetDifference('UTC+01:00', 'UTC+00:00')).toBe(60);
});

test('isGapEnough is correct for various options', () => {
  expect(
    isGapEnough('2022-12-15', '12:00', '2022-12-15', '12:01', 60)
  ).toBeTruthy();
  expect(
    isGapEnough('2022-12-15', '12:00', '2022-12-15', '12:01', 61)
  ).toBeFalsy();
});

test('getDurationInSeconds is correct for various options', () => {
  expect(getDurationInSeconds(1, 0, 0)).toBe(24 * 60 * 60);
  expect(getDurationInSeconds(0, 1, 0)).toBe(60 * 60);
  expect(getDurationInSeconds(0, 0, 1)).toBe(60);
});

test('CountDownText various dates', () => {
  const now = new Date();
  expect(countdownText(addDays(now, 2))).toBe('2 days');
  expect(countdownText(addDays(now, 54))).toBe('about 2 months');
  expect(countdownText(addMinutes(addHours(now, 7), 35))).toBe('7 hours');
  expect(countdownText(addSeconds(addMinutes(now, 4), 35))).toBe('4 minutes');
  expect(countdownText(addSeconds(now, 4))).toBe('less than a minute');
});
