import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import Header from '@/src/components/ui/Header';

const headerCardVariants = cva('w-full h-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

export interface HeaderCardProps
  extends CardProps,
    VariantProps<typeof headerCardVariants> {
  title: string;
  btnLabel: string;
  btnOnClick: React.MouseEventHandler<HTMLButtonElement>;
}

const HeaderCard = React.forwardRef<HTMLDivElement, HeaderCardProps>(
  ({ className, title, btnLabel, btnOnClick, ...props }, ref) => {
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
        <div className="flex w-full items-center justify-between gap-y-6">
          <Header>{title}</Header>
          <Button variant="default" label={btnLabel} onClick={btnOnClick} />
        </div>
        {props.children}
      </Card>
    );
  }
);
HeaderCard.displayName = 'Card';

export { HeaderCard, headerCardVariants };
