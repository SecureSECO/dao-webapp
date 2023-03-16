import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/src/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-md bg-slate-100 p-1 dark:bg-slate-800',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-slate-700 transition-all  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100',
      className
    )}
    {...props}
    ref={ref}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const tabsContentVariants = cva(
  'w-full h-fit rounded-lg font-medium shadow-md mt-2',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-slate-800',
        border: 'border border-slate-200 p-6 dark:border-slate-700',
        light: 'bg-slate-100 dark:bg-slate-700/50',
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
  }
);

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, padding, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(tabsContentVariants({ variant, padding, className }))}
    {...props}
    ref={ref}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
