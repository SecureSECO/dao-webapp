/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The HeaderCard module provides a pre-styled card component with a header and optional aside content.
 * It extends the base Card component with additional layout and styling.
 */

import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';

const headerCardVariants = cva('w-full h-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

/**
 * HeaderCardProps interface represents the props for the HeaderCard component.
 * @extends CardProps - Extends the CardProps from the base Card component.
 * @extends VariantProps<typeof headerCardVariants> - Extends the VariantProps from class-variance-authority.
 */
export interface HeaderCardProps
  extends CardProps,
    VariantProps<typeof headerCardVariants> {
  title: string;
  aside?: ReactNode;
}

/**
 * The HeaderCard component is a pre-styled card component with a header and optional aside content.
 * It extends the base Card component with additional layout and styling.
 * @param props - Props for the HeaderCard component.
 * @returns A HeaderCard React element.
 */
const HeaderCard = React.forwardRef<HTMLDivElement, HeaderCardProps>(
  ({ className, title, aside = '', ...props }, ref) => {
    return (
      <Card
        ref={ref}
        padding="lg"
        className={cn(
          headerCardVariants({}),
          className,
          'flex flex-col justify-between gap-y-6 sm:flex-row sm:items-center'
        )}
        {...props}
      >
        <div className="space-y-6">
          <Header>{title}</Header>
          {props.children}
        </div>
        <div>{aside}</div>
      </Card>
    );
  }
);
HeaderCard.displayName = 'Card';

export { HeaderCard, headerCardVariants };
