/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ClassValue, clsx } from 'clsx';
import { BigNumber } from 'ethers';
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
export function isNullOrUndefined<T>(
  value: T | undefined | null
): value is undefined | null {
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
 * Calculate the percentage of part of a whole of two bigints
 * @param numerator Numerator of the division
 * @param denominator Denominator of the division
 * @returns The percentage of the division as a number
 */
export const calcBigintPercentage = (
  numerator: bigint,
  denominator: bigint
): number => {
  if (denominator === 0n) return 0;
  return Number((numerator * 10000n) / denominator) / 100;
};

/**
 * Calculate the percentage of part of a whole of two BigNumbers (from ethers)
 * @param numerator Numerator of the division
 * @param denominator Denominator of the division
 * @returns The percentage of the division as a number
 * @note This function is a wrapper around calcBigintPercentage
 */
export const calcBigNumberPercentage = (
  numerator: BigNumber,
  denominator: BigNumber
): number => {
  return calcBigintPercentage(numerator.toBigInt(), denominator.toBigInt());
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

/**
 * Truncates the middle of a string with an ellipsis if it is longer than a specified maximum length. maximum length must be at least 4 or more
 * @param address - The string to truncate.
 * @param maxLength - The maximum length of the string. If the string is longer than this, it will be truncated in the middle with an ellipsis. A negative value means no truncation. Minimum value is 4.
 * @returns - The truncated string.
 * @example
 * const truncated = truncateMiddle("0x1234567890123456789012345678901234567890", 20);
 * console.log(truncated); // "0x1234567…234567890"
 */
export const truncateMiddle = (address: string, maxLength: number) => {
  if (address.length <= maxLength || maxLength < 0) return address;
  const lengthToKeep = maxLength - 2;
  const start = address.slice(0, lengthToKeep / 2);
  const end = address.slice(-lengthToKeep / 2);
  return `${start}…${end}`;
};

/**
 * Copies a string to the clipboard.
 * @param address - The string to copy to the clipboard.
 * @example
 * copyToClipboard("0x1234567890123456789012345678901234567890");
 */
export const copyToClipboard = (address: string) => {
  navigator.clipboard.writeText(address);
};

export function throwIfNullOrUndefined<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined');
  }
  return value;
}

export function assertUnreachable(x: never): never {
  throw new Error('Reached a state that was asserted to be unreachable');
}

export function IsEmptyOrOnlyWhitespace(x: string): boolean {
  return x.trim() === '';
}

/**
 * Lowercases the first letter of a string
 * @param x String to lowercase the first letter of
 * @returns The string with the first letter lowercased
 */
export function lowerCaseFirst(x: string): string {
  return x.charAt(0).toLowerCase() + x.slice(1);
}

/**
 * Utility function to index objects with null chaining.
 */
export function indexObject<T>(
  object: T | null | undefined,
  index: keyof T | null | undefined
): T[keyof T] | null | undefined {
  if (isNullOrUndefined(object) || isNullOrUndefined(index)) {
    return null;
  }
  return object[index];
}

/** Taken from https://stackoverflow.com/questions/29292921/how-to-use-promise-all-with-an-object-as-input
 * Promise.all for entries of an object. Will resolve when all values of the object have been resolved.
 */
export async function promiseObjectAll<T extends Record<keyof T, any>>(
  obj: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(
    Object.entries(obj).map(async ([k, v]) => [k, await v])
  ).then(Object.fromEntries);
}

/**
 * Executes a promise (action) only when the condition is true. Otherwise a promise with defaultValue is returned.
 */
export async function promiseWhenWithDefaultvalue<TResult, TDefault>(
  when: boolean,
  action: () => Promise<TResult>,
  defaultValue: TDefault
): Promise<TResult | TDefault> {
  if (when) {
    return action();
  }
  return new Promise(() => defaultValue);
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
): number {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}
