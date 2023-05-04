/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The DropdownMenu component is the root component of the dropdown menu system,
 * @see https://www.radix-ui.com/docs/primitives/components/dropdown-menu - Radix UI DropdownMenu Primitive
 * built using Radix UI's DropdownMenu primitive adapted and inspired by https://ui.shadcn.com/docs/primitives/dropdown-menu
 */

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { HiChevronRight, HiCheck } from 'react-icons/hi2';

import { cn } from '@/src/lib/utils';

/**
 * The DropdownMenu component is the root component of the dropdown menu system,
 * It is a wrapper for Radix UI's DropdownMenu primitive that provides the context for the other components.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;

/**
 * The DropdownMenuTrigger component is a wrapper for Radix UI's DropdownMenu Trigger
 * primitive that is used to open or close the dropdown menu when clicked.
 * @param props - Props for the DropdownMenuTrigger component.
 * @returns A DropdownMenuTrigger React element.
 */
const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn('group', className)}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

/**
 * The DropdownMenuGroup component is a wrapper for Radix UI's DropdownMenu Group
 * primitive that groups related items together within the dropdown menu.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * The DropdownMenuPortal component is a wrapper for Radix UI's DropdownMenu Portal
 * primitive which is used to render the dropdown menu contents in a React portal.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * The DropdownMenuSub component is a wrapper for Radix UI's DropdownMenu Sub
 * primitive that represents a nested submenu within the dropdown menu.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * The DropdownMenuRadioGroup component is a wrapper for Radix UI's DropdownMenuPrimitive RadioGroup
 * primitive that is used to group related radio items together within the dropdown menu.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/**
 * The DropdownMenuSubTrigger component is a wrapper for Radix UI's DropdownMenu SubTrigger
 * primitive that is used to open or close a nested submenu when clicked.
 * @param props - Props for the DropdownMenuSubTrigger component.
 * @returns A DropdownMenuSubTrigger React element.
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <HiChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

/**
 * The DropdownMenuSubContent component is a wrapper for Radix UI's DropdownMenu SubContent
 * primitive that renders the contents of a nested submenu within the dropdown menu.
 * @param props - Props for the DropdownMenuSubContent component.
 * @returns A DropdownMenuSubContent React element.
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'text-on-popover z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

/**
 * The DropdownMenuContent component is a wrapper for Radix UI's DropdownMenu Content
 * primitive that renders the contents of the dropdown menu.
 * @param props - Props for the DropdownMenuContent component.
 * @returns A DropdownMenuContent React element.
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

/**
 * The DropdownMenuItem component is a wrapper for Radix UI's DropdownMenu Item
 * primitive that represents an individual item within the dropdown menu.
 * @param props - Props for the DropdownMenuItem component.
 * @returns A DropdownMenuItem React element.
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

/**
 * The DropdownMenuCheckboxItem component is a wrapper for Radix UI's DropdownMenu CheckboxItem
 * primitive that represents an individual checkbox item within the dropdown menu.
 * @param props - Props for the DropdownMenuCheckboxItem component.
 * @returns A DropdownMenuCheckboxItem React element.
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <HiCheck className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

type CustomRadioItemProps = {
  hasIndicator?: boolean;
};

/**
 * The DropdownMenuRadioItem component is a wrapper for Radix UI's DropdownMenu RadioItem
 * primitive that represents an individual radio item within the dropdown menu.
 * @param props - Props for the DropdownMenuRadioItem component.
 * @returns A DropdownMenuRadioItem React element.
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> &
    CustomRadioItemProps
>(({ className, children, hasIndicator = false, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
      hasIndicator ? 'pl-8' : 'pl-2'
    )}
    {...props}
  >
    {hasIndicator && (
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <div className="h-2 w-2 rounded-full bg-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    )}
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

/**
 * The DropdownMenuLabel component is a wrapper for Radix UI's DropdownMenu Label
 * primitive that represents a label within the dropdown menu.
 * @param props - Props for the DropdownMenuLabel component.
 * @returns A DropdownMenuLabel React element.
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

/**
 * The DropdownMenuSeparator component is a wrapper for Radix UI's DropdownMenu Separator
 * primitive that visually separates groups of items within the dropdown menu.
 * @param props - Props for the DropdownMenuSeparator component.
 * @returns A DropdownMenuSeparator React element.
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

/**
 * The DropdownMenuShortcut component is a wrapper for Radix UI's DropdownMenu Shortcut
 * primitive that represents a keyboard shortcut within the dropdown menu.
 * @param props - Props for the DropdownMenuShortcut component.
 * @returns A DropdownMenuShortcut React element.
 */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
