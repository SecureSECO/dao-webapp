import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { IconType } from 'react-icons/lib';

const buttonVariants = cva(
  'active:scale-95 leading-4 inline-flex w-fit items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-default disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white dark:text-slate-300 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary focus:ring-primary-400 dark:focus:ring-slate-400', // for button that opens some menu: data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800
        destructive:
          'bg-red-500 text-white hover:bg-red-600  focus:ring-red-400',
        outline:
          'bg-transparent border border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800 dark:text-slate-100 focus:ring-primary-100 dark:focus:ring-primary-400',
        subtle:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700/50 dark:text-slate-100 focus:ring-primary-200 dark:focus:ring-primary-400',
        ghost:
          'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 focus:ring-primary-200',
        link: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 focus:ring-primary-200 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-10 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const iconVariants = cva('transition-all duration-200', {
  variants: {
    size: {
      default: 'h-5 w-5',
      sm: 'h-4 w-4',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  icon?: IconType | null;
  iconNode?: ReactNode | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, icon, iconNode, variant, size, label, children, ...props },
    ref
  ) => {
    const IconWrapper = { icon };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {icon && IconWrapper.icon ? (
          <div className="flex flex-row items-center gap-x-2">
            <IconWrapper.icon
              className={cn(iconVariants({ size, className }))}
            />
            {(label || children) && <>{label || children}</>}
          </div>
        ) : (
          <div className="flex flex-row items-center gap-x-2">
            {iconNode && <>{iconNode}</>}
            {label || children}
          </div>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
