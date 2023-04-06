/**
 * The RadioGroup module provides a customizable and accessible radio group component.
 * It supports various styles and can be used for selecting a single option from a list of choices.
 * @see https://www.radix-ui.com/docs/primitives/components/radio-group - Radix UI Radio Group Primitive
 * inspired by https://ui.shadcn.com/docs/primitives/radio-group
 */

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/src/lib/utils';

/**
 * The RadioGroup component wraps a group of RadioGroupItems, providing a layout and common properties for the items.
 * @param {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>} props - The properties for the RadioGroup component.
 * @returns A RadioGroup React element.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * The RadioGroupItem component represents an individual radio button within a RadioGroup.
 * It can be customized with different styles and sizes and is designed to work within the RadioGroup component.
 * @param {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>} props - The properties for the RadioGroupItem component.
 * @returns A RadioGroupItem React element.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'text:fill-slate-50 h-4 w-4 rounded-full border border-slate-300 text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-400 dark:text-slate-200 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-slate-700 dark:bg-slate-200" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
