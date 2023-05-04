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

import { cn } from '@/src/lib/utils';

const cardVariants = cva(
  'w-full rounded-lg h-fit shadow-md text-clip relative',
  {
    variants: {
      variant: {
        default: 'bg-highlight ',
        warning:
          'bg-destructive-background text-destructive-foreground shadow-lg',
        light: 'bg-popover',
        outline: 'bg-transparent border border-border shadow-none',
      },
      size: {
        default: 'px-5 py-4',
        sm: 'px-4 py-2',
        lg: 'px-6 sm:px-10 py-4 sm:py-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Variants used when the `loading` property's value is true.
 * This uses the `size` prop passed to the Card component to also determine a min-height to give the Card component,
 * such that the pulse animation is sufficiently visible.
 */
const loadingVariants = cva('animate-pulse', {
  variants: {
    size: {
      default: 'min-h-[100px]',
      sm: 'min-h-[50px]',
      lg: 'min-h-[150px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

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
 * @param props.variant - Variant of the card that defines its styling.
 * @param props.size - Size of the card as defined by padding.
 * @param props.loading - Optional boolean flag to enable/disable the loading state, which will show a pulse animation. It is recommended to also pass a minimum height when providing a loading variable.
 * @returns A Card React element.
 * @remarks This component is built using the class-variance-authority library for managing CSS classes. You can pass a loading property to enable a loading state with a pulse animation.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, loading = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, className }),
          loading && loadingVariants({ size })
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
