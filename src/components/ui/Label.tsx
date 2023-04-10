/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The Label module provides a pre-styled label component based on @radix-ui/react-label
 *
 * @see https://www.radix-ui.com/docs/primitives/components/label - Radix UI Label Primitive
 * This component is based on the native label element,
 * it will automatically apply the correct labelling when wrapping controls or using the htmlFor attribute.
 *
 * Inspired by https://ui.shadcn.com/docs/primitives/label
 */

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/src/lib/utils';

/**
 * The Label component is a pre-styled label element based on @radix-ui/react-label.
 * It extends the base LabelPrimitive.Root component with additional styling.
 * @param props - Props for the Label component.
 * @returns A Label React element.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
