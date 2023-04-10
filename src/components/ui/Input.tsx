/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The Input module provides a customizable and accessible input component.
 * It supports various styles and can be used to capture user input.
 * Inspired by https://ui.shadcn.com/docs/primitives/input
 */
import * as React from 'react';
import { cn } from '@/src/lib/utils';
import { FieldError } from 'react-hook-form';

/**
 * InputProps interface represents the props for the Input component.
 * @property {FieldError | undefined} error - An optional error object from 'react-hook-form' to manage input validation.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

/**
 * The Input component is a styled wrapper around the standard HTML input element.
 * It includes support for handling validation errors and can be customized with different styles.
 * @param {InputProps} props - The properties for the Input component.
 * @returns An Input React element.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-slate-50 dark:focus:ring-offset-slate-800',

          error
            ? 'border-red-600 focus:ring-red-600 dark:border-red-700 dark:focus:ring-red-700'
            : 'border-slate-300 focus:ring-slate-400 dark:border-slate-700 dark:focus:ring-slate-400',

          className
        )}
        ref={ref}
        aria-invalid={error ? true : false}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
