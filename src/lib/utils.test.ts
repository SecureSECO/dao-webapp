import { addDays, addHours, addMinutes, addSeconds } from 'date-fns';
import { anyNullOrUndefined, cn, countdownText } from './utils';

// These are very simplistic tests, mostly meant as example tests.

// CN tests

test('cn with padding conflicts uses last padding', () => {
  expect(cn('p-0 p-32')).toBe('p-32');
  expect(cn('p-0', 'p-32')).toBe('p-32');
});

test('cn with simple && returns correct', () => {
  expect(cn('p-0', false && 'm-1', true && 'grow-0')).toBe('p-0 grow-0');
});

// Null undefined tests
test('anyNullOrUndefined works for null and undefined', () => {
  expect(anyNullOrUndefined(null)).toBeTruthy;
  expect(anyNullOrUndefined(undefined)).toBeTruthy;
});

test('anyNullOrUndefined does not trigger for falsy values', () => {
  expect(anyNullOrUndefined(0, '', 'null', 'undefined')).toBeFalsy;
});

test('CountDownText various dates', () => {
  const now = new Date();
  expect(countdownText(addDays(now, 2))).toBe('2 days');
  expect(countdownText(addDays(now, 54))).toBe('about 2 months');
  expect(countdownText(addMinutes(addHours(now, 7), 35))).toBe('7 hours');
  expect(countdownText(addSeconds(addMinutes(now, 4), 35))).toBe('4 minutes');
  expect(countdownText(addSeconds(now, 4))).toBe('less than a minute');
});
