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
          'flex h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-highlight-foreground/50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-destructive focus:ring-destructive'
            : 'border-input focus:ring-primary/50',

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
