//Taken from https://ui.shadcn.com/docs/primitives/input
import * as React from 'react';
import { cn } from '@/src/lib/utils';
import { FieldError } from 'react-hook-form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, name, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1">
        <input
          className={cn(
            'flex h-10 w-full rounded-md border bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-slate-50 dark:focus:ring-offset-slate-800',

            error
              ? 'border-red-600 focus:ring-red-600 dark:border-red-700 dark:focus:ring-red-700'
              : 'border-slate-300 focus:ring-slate-400 dark:border-slate-700 dark:focus:ring-slate-400',

            className
          )}
          ref={ref}
          aria-invalid={error ? true : false}
          {...props}
        />
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
Input.displayName = 'Input';

export { Input };
