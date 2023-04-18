/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The RadioGroup module provides a customizable and accessible radio group component.
 * It supports various styles and can be used for selecting a single option from a list of choices.
 * @see https://www.radix-ui.com/docs/primitives/components/radio-group - Radix UI Radio Group Primitive
 * inspired by https://ui.shadcn.com/docs/primitives/radio-group
 */

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/src/lib/utils';
import { FieldError } from 'react-hook-form';

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
        'text:fill-slate-50 h-4 w-4 shrink-0 rounded-full border border-slate-300 text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-400 dark:text-slate-200 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
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

interface RadioButtonCardProps<T extends string>
  extends RadioGroupPrimitive.RadioGroupItemProps {
  error?: FieldError;
  id: T;
  value: T;
  title: string;
  description?: string;
}

/**
 * Radio button card for the designof the radio buttons
 */
function RadioButtonCard<T extends string>({
  className,
  id,
  error,
  value,
  description,
  title,
  ...props
}: RadioButtonCardProps<T>) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex w-full cursor-pointer rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-offset-slate-800',
        error
          ? 'border-red-600 focus:ring-red-600 dark:border-red-700 dark:focus:ring-red-700'
          : value === id && 'ring-2 ring-primary-500 dark:ring-primary-400 ',
        className
      )}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <span className="text-base text-slate-700 dark:text-slate-300">
            {title}
          </span>
          <RadioGroupItem value={id} id={id} className="group" {...props} />
        </div>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </label>
  );
}

RadioButtonCard.displayName = 'RadioButtonCard';

export { RadioGroup, RadioGroupItem, RadioButtonCard };
