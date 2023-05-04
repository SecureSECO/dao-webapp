/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * This component uses the `class-variance-authority` package to generate dynamic class names based on the provided props.
 * Inspired by https://ui.shadcn.com/docs/primitives/button.
 */

import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';
import { IconType } from 'react-icons/lib';

/**
 * The generated variants for the `Button` component, based on the `class-variance-authority` package.
 */
const buttonVariants = cva(
  'active:scale-95 leading-4 inline-flex w-fit transition-colors duration-200 items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-default disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary-highlight',
        destructive:
          'bg-destructive-background text-destructive-foreground hover:bg-destructive-background/80 focus:ring-destructive',
        outline:
          'bg-transparent text-background-foreground border border-border hover:bg-accent focus:ring-primary-highlight/20',
        subtle:
          'bg-accent text-accent-foreground hover:bg-accent/70 focus:ring-primary-highlight/50',
        ghost:
          'bg-transparent text-background-foreground hover:bg-accent focus:ring-primary-highlight/20',
      },
      size: {
        default: 'h-10 py-2 px-4 ',
        xs: 'h-8 px-3 rounded-md',
        sm: 'h-10 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const iconVariants = cva('transition-all duration-200 shrink-0', {
  variants: {
    size: {
      default: 'h-5 w-5',
      xs: 'h-4 w-4',
      sm: 'h-4 w-4',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  icon?: IconType | null;
  iconNode?: ReactNode | null;
}

/**
 * A component that renders a button with customizable styling and an optional icon.
 * @param props - Props for the `Button` component.
 * @param [props.className] - Additional CSS classes to apply to the button.
 * @param [props.icon] - The icon to display in the button. If `iconNode` is also provided, this icon will be ignored.
 * @param [props.iconNode] - A custom icon node to display in the button. If provided, `icon` will be ignored.
 * @param [props.variant="default"] - The variant of the button to use.
 * @param [props.size="default"] - The size of the button to use.
 * @param [props.label] - The label to display in the button, which will be read by screen readers.
 * @param [props.children] - The content to display inside the button.
 * @returns - A React element representing the `Button` component.
 * @example
 * <Button
 *   icon={AiFillCheckCircle}
 *   label="Submit"
 *   variant="outline"
 *   size="lg"
 *   onClick={() => console.log('Button clicked!')}
 * >
 *   Submit
 * </Button>
 *  @remark - You can pass either a label or children to the button, if you pass both, the label will be used.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, icon, iconNode, variant, size, label, children, ...props },
    ref
  ) => {
    const IconWrapper = { icon };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {icon && IconWrapper.icon ? (
          <div className="flex flex-row items-center gap-x-2 leading-4">
            <IconWrapper.icon
              className={cn(iconVariants({ size, className }))}
            />
            {(label || children) && <>{label || children}</>}
          </div>
        ) : (
          <>
            {iconNode ? (
              <div className="flex flex-row items-center gap-x-2 leading-4">
                {iconNode}
                {label || children}
              </div>
            ) : (
              <>{label || children}</>
            )}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants, iconVariants };
