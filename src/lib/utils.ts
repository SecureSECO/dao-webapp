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

export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

export function anyNullOrUndefined(...values: any[]): boolean {
  return values.some(isNullOrUndefined);
}

export const countdownText = (date: Date) => {
  const now = new Date();
  if (Math.abs(differenceInHours(date, now)) > 24) {
    return formatDistanceToNow(date);
  } else if (Math.abs(differenceInMinutes(date, now)) > 60) {
    return `${Math.abs(differenceInHours(date, now))} hours`;
  } else if (Math.abs(differenceInMinutes(date, now)) > 1) {
    return `${Math.abs(differenceInMinutes(date, now))} minutes`;
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
