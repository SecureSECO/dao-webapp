/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * This is a Card component that supports various variants and padding options.
 * It also provides a loading state with a pulse animation.
 */
import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const cardVariants = cva(
  'w-full rounded-lg h-fit shadow-md text-clip relative',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-slate-700/50',
        warning: 'bg-red-500/80 text-slate-50 shadow-lg',
        light: 'bg-slate-50 dark:bg-slate-700/50',
      },
      padding: {
        default: 'px-6 py-4',
        sm: 'px-4 py-2',
        lg: 'px-6 sm:px-10 py-4 sm:py-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

/**
 * Card component properties.
 * @property className - Optional custom CSS class name.
 * @property variant - Visual style of the card. Can be "default", "warning", or "light".
 * @property padding - Padding applied to the card. Can be "default", "sm", or "lg".
 * @property loading - Optional boolean flag to enable/disable the loading state.
 */
export interface CardProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean;
}

/**
 * A Card component that supports various visual styles, padding options, and a loading state.
 * @param props - Props for the Card component.
 * @returns A Card React element.
 * @remarks This component is built using the class-variance-authority library for managing CSS classes. You can pass a loading property to enable a loading state with a pulse animation.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, loading = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, className }),
          loading && 'animate-pulse'
        )}
        {...props}
      >
        {!loading && props.children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card, cardVariants };
