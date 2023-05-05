/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
