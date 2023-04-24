/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ClassValue, clsx } from 'clsx';
import {
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
} from 'date-fns';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for combining html Class Names (CN).
 * For conflicting styles, the 'latest' style is used.
 *
 * @remarks
 * This function is a combination of clsx and and tailwindMerge
 *
 * @param inputs - A list of 'rich' class names. See clsx documentation for what 'rich' means
 * @returns Optimized class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Utility function for checking if a value is null or undefined
 * @param value The value to check
 * @returns True iff the value is null or undefined
 */
export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * Utility function for checking if any value of a array of values is Null or Undefined
 * @param value An array of values to check
 * @returns True iff any of the values is null or undefined
 */
export function anyNullOrUndefined(...values: any[]): boolean {
  return values.some(isNullOrUndefined);
}

/**
 * Utility function to create count down text for dates
 * @param date The date
 * @returns
 */
export const countdownText = (date: Date) => {
  const now = new Date();
  const hourDif = Math.abs(differenceInHours(date, now));
  const minuteDif = Math.abs(differenceInMinutes(date, now));
  if (hourDif > 24) {
    return formatDistanceToNow(date);
  } else if (minuteDif > 60) {
    return `${hourDif} hours`;
  } else if (minuteDif > 1) {
    return `${minuteDif} minutes`;
  } else {
    return 'less than a minute';
  }
};

/**
 * Calculate the percentage of part of a whole of two bigints
 * @param numerator Numerator of the division
 * @param denominator Denominator of the division
 * @returns The percentage of the division as a number
 */
export const calcBigintPercentage = (
  numerator: bigint,
  denominator: bigint
): number => {
  return Number((numerator * 10000n) / denominator) / 100;
};

/**
 * Performs the same logical task as the standard some method for lists.
 * However, it does not test the entire list, but from the start (index 0) untill (exclusive) the given index.
 */
export function someUntil<T>(
  list: T[],
  predicate: (arg: T) => Boolean,
  untillExclusive: number
): Boolean {
  for (let i = 0; i < list.length && i < untillExclusive; i++) {
    if (predicate(list[i])) {
      return true;
    }
  }
  return false;
}
