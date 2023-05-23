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
import { ReactNode } from 'react';
import { buttonVariants, iconVariants } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { IconType } from 'react-icons/lib';
import { Link as RouterLink } from 'react-router-dom';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof buttonVariants> {
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
  ({ className, iconNode, variant, size, label, children, ...props }, ref) => {
    const { icon, ...divProps } = props;

    return (
      <RouterLink
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...divProps}
      >
        <span className="sr-only">{label}</span>
        {props.icon ? (
          <div className="flex flex-row items-center gap-x-2 leading-4">
            <props.icon className={cn(iconVariants({ size }))} />
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
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';

export { Link };
