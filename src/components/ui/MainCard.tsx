import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import { IconType } from 'react-icons/lib';

const mainCardVariants = cva('w-full h-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

export interface MainCardProps
  extends CardProps,
    VariantProps<typeof mainCardVariants> {
  icon: IconType;
  header: ReactNode;
  aside: ReactNode;
}

const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  ({ className, header, aside, icon, ...props }, ref) => {
    const IconWrapper = { icon };

    return (
      <Card
        ref={ref}
        className={cn(mainCardVariants({}), className)}
        {...props}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-3 lg:gap-x-6">
            <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-700/50">
              <IconWrapper.icon className="h-5 w-5 text-primary dark:text-primary-500" />
            </div>
            <div className="hidden xs:block">{header}</div>
          </div>
          <>{aside}</>
        </div>
        <div className="xs:hidden">{header}</div>
        <div>{props.children}</div>
      </Card>
    );
  }
);
MainCard.displayName = 'MainCard';

export { MainCard, mainCardVariants as cardVariants };
