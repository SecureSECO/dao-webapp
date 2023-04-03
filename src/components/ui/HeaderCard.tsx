import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';

const headerCardVariants = cva('w-full h-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

export interface HeaderCardProps
  extends CardProps,
    VariantProps<typeof headerCardVariants> {
  title: string;
  aside: ReactNode;
}

const HeaderCard = React.forwardRef<HTMLDivElement, HeaderCardProps>(
  ({ className, title, aside: button, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        padding="lg"
        className={cn(
          headerCardVariants({}),
          className,
          'flex flex-col justify-between gap-y-8'
        )}
        {...props}
      >
        <div className="flex w-full flex-col justify-between gap-y-6 sm:flex-row sm:items-center">
          <Header>{title}</Header>
          <>{button}</>
        </div>
        {props.children}
      </Card>
    );
  }
);
HeaderCard.displayName = 'Card';

export { HeaderCard, headerCardVariants };
