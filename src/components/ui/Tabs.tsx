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
import { cva, VariantProps } from 'class-variance-authority';

const tabsVariants = cva('w-full h-fit rounded-lg font-medium shadow-md mt-2', {
  variants: {
    variant: {
      default: 'bg-white dark:bg-slate-800',
      border: 'border border-slate-200 p-6 dark:border-slate-700',
      light: 'bg-slate-50 dark:bg-slate-700/50',
      none: '',
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

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsVariants> {}

/**
 * The Tabs component represents the main container for tabs.
 * It supports multiple variants and padding options.
 * @param {Object} props - The properties for the Tabs component.
 * @param {string} props.className - Optional CSS classes to add to the component.
 * @param {string} props.variant - Optional variant to control the appearance of the Tabs component.
 * @param {string} props.padding - Optional padding option to control the padding of the Tabs component.
 * @returns A Tabs React element.
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, variant, padding, ...props }, ref) => (
  <TabsPrimitive.Root
    className={cn(
      tabsVariants({ variant, padding, className }),
      'flex w-full flex-col items-start gap-y-4'
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
      'inline-flex items-center justify-center rounded-md bg-slate-50 p-1 px-2 dark:bg-slate-700/50',
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
      'inline-flex min-w-[100px] items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100',
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
