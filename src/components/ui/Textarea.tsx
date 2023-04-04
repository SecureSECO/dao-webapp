import * as React from 'react';
import { cn } from '@/src/lib/utils';
import { FieldError } from 'react-hook-form';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex h-20 w-full rounded-md border bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-slate-50  dark:focus:ring-offset-slate-800',
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
