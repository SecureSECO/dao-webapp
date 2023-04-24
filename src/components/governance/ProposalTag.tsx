/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cn } from '@/src/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import {
  HiOutlineClock,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
} from 'react-icons/hi2';

const proposalTagVariants = cva(
  'flex flex-row min-w-fit w-fit gap-x-1 items-center rounded-full px-2 py-0.5 text-sm',
  {
    variants: {
      variant: {
        countdown: 'bg-slate-200 dark:bg-slate-600',
        yes: 'bg-green-200/50 dark:bg-green-300/50 dark:text-slate-800',
        no: 'bg-destructive-background text-destructive-foreground',
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

/**
 * @returns A pill shaped tag showing some information about a proposal, in the given style variant
 */
const ProposalTag = ({
  className,
  variant,
  children,
  ...props
}: ProposalTagProps) => {
  return (
    <div {...props} className={cn(proposalTagVariants({ variant }), className)}>
      {proposalTagIcon[variant as keyof typeof proposalTagIcon]}
      <div className="break-inside-avoid">{children}</div>
    </div>
  );
};

export default ProposalTag;
