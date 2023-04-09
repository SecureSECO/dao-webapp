import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';
import { IconType } from 'react-icons';
import { createElement } from 'react';

const statusVariants = cva(
  'rounded-lg px-2 py-1 flex flex-row w-fit gap-x-1 items-center h-fit',
  {
    variants: {
      variant: {
        primary: 'bg-primary-200 dark:bg-primary-400 dark:text-slate-900',
        secondary: 'bg-slate-200 dark:bg-slate-600',
        green: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        red: 'bg-red-200 dark:bg-red-300 dark:text-slate-900',
      },
      size: {
        sm: 'text-sm px-2 py-1 gap-x-1',
        md: 'text-lg px-3 py-1 gap-x-2',
        lg: 'text-xl px-4 py-2 gap-x-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  }
);

const iconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export interface StatusBadgeProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  icon: IconType;
  text: string;
}

/**
 * A badge showing a status with an icon and text
 * @returns A div showing the passed text with predefined color and size
 */
export const StatusBadge = ({
  icon,
  size,
  variant,
  text,
  className,
  ...props
}: StatusBadgeProps) => {
  return (
    <div
      className={cn(statusVariants({ size, variant }), className)}
      {...props}
    >
      {createElement(icon, { className: cn(iconVariants({ size })) })}
      <p>{text}</p>
    </div>
  );
};
