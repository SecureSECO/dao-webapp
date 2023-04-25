/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The Progress module provides a customizable progress bar component.
 * It supports different sizes and variants, and can be used to display the progress of an operation.
 * @see https://www.radix-ui.com/docs/primitives/components/progress - Radix UI Progress Primitive
 * Inspired, but adapted from: https://ui.shadcn.com/docs/primitives/progress
 */

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/src/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

/**
 * `progressVariants` defines the available variants and sizes for the Progress component.
 * It includes configuration for default and alternative variants, as well as small and medium sizes.
 */
const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'h-2',
        md: 'h-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * The Progress component is a customizable progress bar that supports different sizes and variants.
 * @param {React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & VariantProps<typeof progressVariants>} props - The properties for the Progress component.
 * @returns A Progress React element.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>
>(({ className, size, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
