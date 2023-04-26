/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * This file contains a set of Dialog components using the Radix UI DialogPrimitive.
 * @see https://www.radix-ui.com/docs/primitives/components/dialog - Radix UI Dialog Primitive
 * These components provide a customizable and accessible implementation of the Dialog pattern.
 *
 * Inspired by https://ui.shadcn.com/docs/primitives/dialog
 */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { HiXMark } from 'react-icons/hi2';

import { cn } from '@/src/lib/utils';

/**
 * The Dialog component is the parent component that provides the context for the other components.
 */
const Dialog = DialogPrimitive.Root;

/**
 * The DialogTrigger component is the trigger that toggles the Dialog.
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * The DialogPortal component is responsible for rendering the Dialog
 * inside a Portal, ensuring it's always on top of other content.
 * @param props - Props for the DialogPortal component.
 * @returns A DialogPortal React element.
 */
const DialogPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={cn(className)} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

/**
 * The DialogOverlay component creates a semi-transparent background
 * behind the Dialog, which can be clicked to close the Dialog.
 * @param props - Props for the DialogOverlay component.
 * @returns A DialogOverlay React element.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
      className
    )}
    {...props}
    ref={ref}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * The DialogContent component represents the main content area of the Dialog,
 * including the header, footer, and body. It also renders the DialogOverlay
 * and the Close button.
 * @param props - Props for the DialogContent component.
 * @returns A DialogContent React element.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 grid w-full gap-4 rounded-b-lg bg-highlight px-6 py-4 text-popover-foreground animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-popover-foreground">
        <HiXMark className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * The DialogHeader component represents the header section of a Dialog,
 * which usually contains the Dialog title and an optional description.
 * @param props - Props for the DialogHeader component.
 * @returns A DialogHeader React element.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

/**
 * The DialogFooter component represents the footer section of a Dialog,
 * which usually contains action buttons such as "Confirm" or "Cancel".
 * @param props - Props for the DialogFooter component.
 * @returns A DialogFooter React element.
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

/**
 * The DialogTitle component displays the title text of the Dialog,
 * which is usually placed in the DialogHeader section.
 * @param props - Props for the DialogTitle component.
 * @returns A DialogTitle React element.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-xl font-semibold', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * The DialogDescription component displays the description text of the Dialog,
 * which is usually placed in the DialogHeader section beneath the title.
 * @param props - Props for the DialogDescription component.
 * @returns A DialogDescription React element.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-popover-foreground/80', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogClose = DialogPrimitive.Close;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
