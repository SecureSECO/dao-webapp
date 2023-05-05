/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The MainCard module provides a customizable card component with an icon, header, and aside section.
 * It is designed to be used as a main container for other components and elements.
 */

import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import { IconType } from 'react-icons/lib';

const mainCardVariants = cva('w-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
});

const iconBackgroundVariants = cva('rounded-md p-2', {
  variants: {
    variant: {
      default: 'bg-popover',
      light: 'bg-highlight',
      warning: 'bg-destructive/20',
      outline: 'bg-highlight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Default header for the MainCard component.
 * @param props.value The numeric value to be displayed in the header.
 * @param props.label The label of the value to be displayed in the header.
 * @param props.truncateMobile Whether or not to hide all but the first word of the label on mobile. Defaulted to `false`.
 * @returns A div to be used as the header for the MainCard component.
 */
export const DefaultMainCardHeader = ({
  value,
  label,
  truncateMobile = false,
}: {
  value: number | string;
  label: string;
  truncateMobile?: boolean;
}) => {
  const split = label.split(' ');

  return (
    <div className="flex flex-row items-end gap-x-2 font-normal">
      <span className="text-3xl">{value}</span>
      {!truncateMobile ? (
        <p className="mb-1 text-base leading-4">{label}</p>
      ) : (
        <p className="mb-1 text-base leading-4">
          {split[0]}{' '}
          <span className="hidden xs:inline">{split.slice(1).join(' ')}</span>
        </p>
      )}
    </div>
  );
};

/**
 * MainCardProps represents the properties for the MainCard component.
 * @property icon - An icon to be displayed on the card, next to the header. Typically a React Icon component.
 * @property header - A header content that is displayed on the card.
 * @property aside - An aside content that is displayed on the card, typically additional information or actions.
 */
export interface MainCardProps
  extends CardProps,
    VariantProps<typeof mainCardVariants> {
  icon: IconType;
  header: ReactNode;
  aside?: ReactNode;
}

/**
 * The MainCard component is a card with an icon, header, and aside section.
 * It is designed to serve as a main container for other components and elements.
 * @param {MainCardProps} props - The properties for the MainCard component.
 * @returns A MainCard React element.
 */
const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  ({ className, header, aside, icon, ...props }, ref) => {
    const IconWrapper = { icon };

    return (
      <Card
        ref={ref}
        className={cn(mainCardVariants({}), className, 'gap-y-4')}
        {...props}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-3 lg:gap-x-4">
            <div className={iconBackgroundVariants({ variant: props.variant })}>
              <IconWrapper.icon className="h-5 w-5 shrink-0 text-primary" />
            </div>
            {/* Only split move the header to next line if content for aside was provided */}
            <div
              className={cn('text-2xl font-medium', aside && 'hidden xs:block')}
            >
              {header}
            </div>
          </div>
          <>{aside && aside}</>
        </div>
        {aside && <div className="xs:hidden">{header}</div>}

        <div className="space-y-3">{props.children}</div>
      </Card>
    );
  }
);
MainCard.displayName = 'MainCard';

export { MainCard, mainCardVariants as cardVariants };
