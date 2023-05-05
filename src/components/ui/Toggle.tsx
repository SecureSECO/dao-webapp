/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @file Custom Toggle Component
 * This file defines a custom toggle component that extends the functionality of the Radix UI toggle primitive.
 * It includes the ability to use custom variants and sizes, and applies custom styling using the `class-variance-authority` package.
 * @see https://www.radix-ui.com/docs/primitives/components/toggle - Radix UI Toggle Primitive
 * This component was inspired by https://ui.shadcn.com/docs/primitives/toggle
 */

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';

// Define custom toggle styling and variants using class-variance-authority
const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors data-[state=on]:bg-muted data-[state=on]:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'bg-transparent border border-input',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Custom Toggle component that supports variants and sizes, and applies custom styling.
 *
 * @param {object} props - The properties for the toggle component.
 * @param {React.Ref} ref - The forwarded ref for the TogglePrimitive.Root.
 *
 * @returns {React.Element} The rendered Toggle component.
 */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
