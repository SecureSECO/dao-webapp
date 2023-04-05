/**
 * The Progress module provides a customizable progress bar component.
 * It supports different sizes and variants, and can be used to display the progress of an operation.
 *  Inspired, but adapted from: https://ui.shadcn.com/docs/primitives/progress
 */

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/src/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

/**
 * `progressVariants` defines the available variants and sizes for the Progress component.
 * It includes configuration for default and alternative variants, as well as small and medium sizes.
 */
const progressVariants = cva('relative w-full overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-2',
      md: 'h-4',
    },
    variant: {
      default: 'bg-slate-200 dark:bg-slate-950',
      alt: 'bg-slate-200 dark:bg-slate-900',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

/**
 * `indicatorVariants` defines the available indicator variants for the Progress component.
 */
const indicatorVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-primary dark:bg-primary-500',
      alt: 'bg-primary-400 dark:bg-primary-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * The Progress component is a customizable progress bar that supports different sizes and variants.
 * @param {React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & VariantProps<typeof progressVariants>} props - The properties for the Progress component.
 * @returns A Progress React element.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>
>(({ className, size, variant, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size, variant, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(indicatorVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
