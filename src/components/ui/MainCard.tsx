/**
 * The MainCard module provides a customizable card component with an icon, header, and aside section.
 * It is designed to be used as a main container for other components and elements.
 */

import React, { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Card, CardProps } from '@/src/components/ui/Card';
import { IconType } from 'react-icons/lib';

const mainCardVariants = cva('w-full flex flex-col gap-y-2', {
  variants: {},
  defaultVariants: {},
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
    <div className="flex flex-row items-end gap-x-2">
      <span className="text-3xl">{value}</span>
      {!truncateMobile ? (
        <p className="mb-1 leading-4">{label}</p>
      ) : (
        <p className="mb-1 leading-4">
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
            <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-700/50">
              <IconWrapper.icon className="h-5 w-5 text-primary dark:text-primary-500" />
            </div>
            <div className="hidden xs:block">{header}</div>
          </div>
          <>{aside && aside}</>
        </div>
        <div className="xs:hidden">{header}</div>
        <div className="space-y-3">{props.children}</div>
      </Card>
    );
  }
);
MainCard.displayName = 'MainCard';

export { MainCard, mainCardVariants as cardVariants };
