/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This file contains a set of custom Tabs components built on top of the '@radix-ui/react-tabs' library.
 * @see https://www.radix-ui.com/docs/primitives/components/tabs - Radix UI Tabs Primitive
 * The components include Tabs, TabsList, TabsTrigger, and TabsContent.
 * These components are styled and provide a consistent UI look and feel for tabs throughout an application. inspired by https://ui.shadcn.com/docs/primitives/tabs
 * The components also have support for multiple variants and padding options, which can be controlled through the props.
 */

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/src/lib/utils';

/**
 * The Tabs component represents the main container for tabs.
 * @param {Object} props - The properties for the Tabs component.
 * @param {string} props.className - Optional CSS classes to add to the component.
 * @returns A Tabs React element.
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    className={cn(
      className,
      'flex w-full flex-col items-start gap-y-4 bg-highlight px-6 py-4 text-highlight-foreground'
    )}
    {...props}
    ref={ref}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

/**
 * The TabsList component represents the list of tab triggers within the Tabs component.
 * @returns A TabsList React element.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-md bg-popover p-1 px-2 text-popover-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * The TabsTrigger component represents an individual tab trigger within the TabsList component.
 * It controls the active state of the associated tab content.
 * @returns A TabsTrigger React element.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex min-w-[100px] items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-popover-foreground transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-highlight data-[state=active]:text-highlight-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
    ref={ref}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * The TabsContent component represents the content of an individual tab.
 * The content will be shown or hidden based on the active state of the associated tab trigger.
 * @returns A TabsContent React element.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn('w-full', className)}
    {...props}
    ref={ref}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
