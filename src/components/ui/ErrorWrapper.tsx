/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cn } from '@/src/lib/utils';
import React from 'react';
import { FieldError } from 'react-hook-form';

/**
 * ErrorWrapperProps interface represents the props for the ErrorWrapper component.
 * @property {FieldError | undefined} error - An optional error object from 'react-hook-form' to manage input validation.
 * @property {string} name - The name of the field related to the error. Will be displayed in the error message.
 *
 * @extends React.HTMLAttributes<HTMLDivElement> - Extends the HTMLDivElement attributes.
 */
interface ErrorWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: FieldError;
  name: string;
}

/**
 * The ErrorWrapper component is a container for form elements that displays error messages
 * associated with the provided error object from react-hook-form.
 * @param props - Props for the ErrorWrapper component.
 * @returns An ErrorWrapper React element.
 */
export const ErrorWrapper = React.forwardRef<HTMLDivElement, ErrorWrapperProps>(
  ({ children, error, name, className }, ref) => {
    return (
      <div className={cn('flex w-full flex-col', className)} ref={ref}>
        {children}
        {error && (
          <span className="text-destructive first-letter:capitalize">
            {error?.type == 'required'
              ? `${name} is required`
              : error?.type == 'minLength'
              ? `${name} is too short`
              : error?.type == 'maxLength'
              ? `${name} is too long`
              : error?.type == 'pattern'
              ? error?.message ?? `${name} is invalid`
              : error?.message ?? `${name} is invalid`}
          </span>
        )}
      </div>
    );
  }
);
ErrorWrapper.displayName = 'ErrorWrapper';
