/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This file contains a custom Textarea component that provides a consistent look and feel for textareas
 * throughout an application. The Textarea component is styled and supports error handling with 'react-hook-form'.
 * inspired by https://ui.shadcn.com/docs/primitives/textarea
 */

import * as React from 'react';
import { cn } from '@/src/lib/utils';
import { FieldError } from 'react-hook-form';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
}

/**
 * The Textarea component represents a styled textarea HTML element.
 * It supports error handling with 'react-hook-form' and can be easily integrated into forms.
 *
 * @param {Object} props - The properties for the Textarea component.
 * @param {string} props.className - Optional CSS classes to add to the component.
 * @param {FieldError} props.error - Optional 'react-hook-form' FieldError object to handle error states.
 * @returns A Textarea React element.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-slate-50  dark:focus:ring-offset-slate-800',
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
Textarea.displayName = 'Textarea';

export { Textarea };
