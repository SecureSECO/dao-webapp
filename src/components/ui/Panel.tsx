import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const panelVariants = cva(
  'w-full h-full rounded-lg text-sm font-medium shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-slate-800',
        warning: 'bg-red-500/80 text-slate-50 shadow-lg',
      },
      padding: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1',
        lg: 'px-10 py-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export interface PanelProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(panelVariants({ variant, padding, className }))}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);
Panel.displayName = 'Panel';

export { Panel, panelVariants };
