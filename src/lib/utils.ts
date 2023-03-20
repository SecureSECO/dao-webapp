import { ClassValue, clsx } from 'clsx';
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
