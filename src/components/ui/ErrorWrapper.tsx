import { cn } from '@/src/lib/utils';
import React from 'react';
import { FieldError } from 'react-hook-form';

interface ErrorWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: FieldError;
  name: string;
}

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
