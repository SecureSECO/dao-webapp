import {
  getDurationDateAhead,
  inputToDate,
  isGapEnough,
  timezoneOffsetDifference,
  timezoneStringFormat,
} from '@/src/lib/date-utils';

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
