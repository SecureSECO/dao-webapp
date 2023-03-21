import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { Link as RouterLink } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { IconType } from 'react-icons/lib';

const linkVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-default disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white dark:text-slate-300 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary focus:ring-primary-400 dark:focus:ring-slate-400',
        outline:
          'text-slate-700 dark:text-slate-100 border-b-2 border-transparent hover:text-slate-900 dark:hover:text-slate-100 focus:ring-primary-100 dark:focus:ring-primary-400',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const iconVariants = cva('', {
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
  to: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, icon, variant, label, children, ...props }, ref) => {
    const IconWrapper = { icon };

    return (
      <RouterLink
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <span className="sr-only">{label}</span>
        {icon && IconWrapper.icon ? (
          <span className="flex flex-row items-center gap-x-2">
            <IconWrapper.icon
              className={cn(iconVariants({ size: 'default', className }))}
            />
            <span className="leading-4">{label || children}</span>
          </span>
        ) : (
          <span className="leading-4">{label || children}</span>
        )}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';

export { Link, linkVariants };
