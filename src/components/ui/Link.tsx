/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The Link module provides a pre-styled link component based on react-router-dom.
 * It extends the RouterLink component with additional styling and accepts both icons and labels.
 */

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { Link as RouterLink } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { IconType } from 'react-icons/lib';
import { ReactNode } from 'react';

const linkVariants = cva(
  'active:scale-95 leading-4 inline-flex w-fit items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-default disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white dark:text-slate-300 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary focus:ring-primary-400 dark:focus:ring-slate-400', // for button that opens some menu: data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800
        outline:
          'bg-transparent border border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800 dark:text-slate-100 focus:ring-primary-100 dark:focus:ring-primary-400',
      },
      size: {
        default: 'h-10 py-2 px-4',
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

const iconVariants = cva('transition-all duration-200', {
  variants: {
    size: {
      default: 'h-5 w-5',
      sm: 'h-4 w-4',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof linkVariants> {
  label?: string;
  icon?: IconType | null;
  iconNode?: ReactNode | null;
  to: string;
}

/**
 * The Link component is a pre-styled link element based on react-router-dom.
 * It extends the RouterLink component with additional styling and accepts both icons and labels.
 * @param props - Props for the Link component.
 * @returns A Link React element.
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, icon, iconNode, variant, size, label, children, ...props },
    ref
  ) => {
    const IconWrapper = { icon };

    return (
      <RouterLink
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {icon && IconWrapper.icon ? (
          <div className="flex flex-row items-center gap-x-2">
            <IconWrapper.icon
              className={cn(iconVariants({ size, className }))}
            />
            {(label || children) && <>{label || children}</>}
          </div>
        ) : (
          <div className="flex flex-row items-center gap-x-2">
            {iconNode && <>{iconNode}</>}
            {label || children}
          </div>
        )}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';

export { Link, linkVariants };
