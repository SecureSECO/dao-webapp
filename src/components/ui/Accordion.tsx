/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * A reusable accordion component built on top of `@radix-ui/react-accordion`.
 *
 * @see https://www.radix-ui.com/docs/primitives/components/accordion - Radix UI Accordion Primitive
 *
 * inspired by https://ui.shadcn.com/docs/primitives/accordion
 */
import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '@/src/lib/utils';
import { HiChevronDown } from 'react-icons/hi2';

/**
 * A component that wraps the `AccordionPrimitive.Item` component, applying custom styles to it.
 * @param props - Props for the `AccordionItem` component.
 * @returns - A TSX element representing the `AccordionItem` component.
 * @remarks This component can be used to customize the styling of the `AccordionPrimitive.Item` component.
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(
  (
    {
      className,
      ...props
    }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    ref
  ) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        'relative w-full  rounded-lg bg-popover text-popover-foreground shadow-md',
        className
      )}
      {...props}
    />
  )
);
AccordionItem.displayName = 'AccordionItem';

/**
 * A component that wraps the `AccordionPrimitive.Content` component, applying custom styles to it.
 * @param props - Props for the `AccordionContent` component, including an optional `className` for additional custom styles.
 * @returns A React element representing the `AccordionContent` component.
 * @remarks This component can be used to customize the styling of the `AccordionPrimitive.Content` component.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(
  (
    {
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className="flex flex-1 items-center justify-between gap-x-4 rounded-lg p-4 font-medium ring-ring transition-all focus:outline-none focus:ring-1 [&[data-state=open]>svg]:rotate-180"
        {...props}
      >
        <div className={className}>{children}</div>
        <HiChevronDown className="h-5 w-5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * A component that wraps the `AccordionPrimitive.Content` component, applying custom styles to it.
 * @param props - Props for the `AccordionContent` component.
 * @returns - A TSX element representing the `AccordionContent` component.
 * @remarks This component can be used to customize the styling of the `AccordionPrimitive.Content` component.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(
  (
    {
      className,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    ref
  ) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden px-4 text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

/**
 * The root component of the accordion, used to wrap all its children.
 */
const Accordion = AccordionPrimitive.Root;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
