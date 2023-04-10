/**
 * ToastProvider component built on top of `@radix-ui/react-toast`.
 *
 * @see https://www.radix-ui.com/docs/primitives/components/toast - Radix UI Accordion Primitive
 *
 * inspired by https://ui.shadcn.com/docs/primitives/toast
 */

import { useToast } from '@/src/hooks/useToast';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/src/components/ui/Toast';

/**
 * Used as a container for all of the active toasts.
 * @returns A ToastProvider component that will serve as the wrapper for all of the active toasts
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
