import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const cardVariants = cva('w-full rounded-lg font-medium shadow-md', {
  variants: {
    variant: {
      default: 'bg-white dark:bg-slate-800',
      warning: 'bg-red-500/80 text-slate-50 shadow-lg',
      light: 'bg-slate-50 dark:bg-slate-700/50',
    },
    padding: {
      default: 'px-6 py-4',
      sm: 'px-4 py-2',
      lg: 'px-10 py-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
});

export interface CardProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card, cardVariants };
