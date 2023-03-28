import { cn } from '@/src/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import {
  HiOutlineClock,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
} from 'react-icons/hi2';

const proposalTagVariants = cva(
  'flex flex-row gap-x-1 items-center rounded-full px-2 py-0.5 text-slate-500 dark:text-slate-400 text-sm',
  {
    variants: {
      variant: {
        countdown: 'bg-slate-200 dark:bg-slate-600',
        yes: 'bg-green-200/50 dark:bg-green-300/50 dark:text-slate-800',
        no: 'bg-red-200/50 dark:bg-red-300/50 dark:text-slate-800',
      },
    },
    defaultVariants: {
      variant: 'countdown',
    },
  }
);

const proposalTagIcon = {
  countdown: <HiOutlineClock className="h-4 w-4" />,
  yes: <HiOutlineHandThumbUp className="h-4 w-4" />,
  no: <HiOutlineHandThumbDown className="h-4 w-4" />,
};

export interface ProposalTagProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof proposalTagVariants> {}

const ProposalTag = ({
  className,
  variant,
  children,
  ...props
}: ProposalTagProps) => {
  return (
    <div {...props} className={cn(proposalTagVariants({ variant }), className)}>
      {proposalTagIcon[variant as keyof typeof proposalTagIcon]}
      {children}
    </div>
  );
};

export default ProposalTag;
