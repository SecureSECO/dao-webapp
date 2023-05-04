/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @file Custom Tooltip Component
 * This file defines a custom tooltip component that wraps the Radix UI tooltip primitive.
 * It applies custom styling to the TooltipContent and exports Tooltip, TooltipTrigger, TooltipContent, and TooltipProvider components.
 * @see https://www.radix-ui.com/docs/primitives/components/tooltip - Radix UI Tooltip Primitive
 * This component was inspired by https://ui.shadcn.com/docs/primitives/tooltip
 */

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/src/lib/utils';

/**
 * Provider to control display delay globally.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Custom Tooltip component. Contains all the parts of a tooltip.
 * @param {object} props - The properties for the tooltip component.
 * @returns {React.Element} The rendered Tooltip component.
 */
const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />;
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName;

/**
 * Custom TooltipTrigger component.
 * The button that toggles the tooltip. By default, the Tooltip.Content will position itself against the trigger.
 */
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Trigger
    ref={ref}
    className={cn(
      'ring-ring ring-offset-2 ring-offset-highlight focus:outline-none focus:ring-1',
      className
    )}
    {...props}
  />
));
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

/**
 * Custom TooltipContent component with additional styling.
 * The component that pops out when the tooltip is open.
 *
 * @param {object} props - The properties for the TooltipContent component.
 * @param {React.Ref} ref - The forwarded ref for the TooltipPrimitive.Content.
 * @returns {React.Element} The rendered TooltipContent component.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
