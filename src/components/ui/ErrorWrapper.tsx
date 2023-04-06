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
      <div className={cn('flex w-full flex-col gap-1', className)} ref={ref}>
        {children}
        <span className="text-red-600 first-letter:capitalize">
          {error?.type == 'required'
            ? `${name} is required`
            : error?.type == 'minLength'
            ? `${name} is too short`
            : error?.type == 'maxLength'
            ? `${name} is too long`
            : error?.type == 'pattern'
            ? `${name} is invalid`
            : error?.message}
        </span>
      </div>
    );
  }
);
ErrorWrapper.displayName = 'ErrorWrapper';
