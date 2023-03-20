import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import { IconType } from 'react-icons/lib';
import { Button } from '@/src/components/ui/Button';

const mainCardVariants = cva('w-full h-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

export interface MainCardProps
  extends CardProps,
    VariantProps<typeof mainCardVariants> {
  icon: IconType;
  header: ReactNode;
  btnLabel: string;
  btnOnClick: React.MouseEventHandler<HTMLButtonElement>;
}

const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  ({ className, header, btnLabel, btnOnClick, icon, ...props }, ref) => {
    const IconWrapper = { icon };

    return (
      <Card
        ref={ref}
        className={cn(mainCardVariants({}), className)}
        {...props}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-6">
            <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-700/50">
              <IconWrapper.icon className="h-5 w-5 text-primary dark:text-primary-500" />
            </div>
            {header}
          </div>
          <Button variant="default" label={btnLabel} onClick={btnOnClick} />
        </div>
        <div>{props.children}</div>
      </Card>
    );
  }
);
MainCard.displayName = 'Card';

export { MainCard, mainCardVariants as cardVariants };
