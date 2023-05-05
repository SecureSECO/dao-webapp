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
import { FaGithub } from 'react-icons/fa';
import {
  HiOutlineBanknotes,
  HiOutlineCircleStack,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
} from 'react-icons/hi2';

const proposalTagVariants = cva(
  'flex flex-row min-w-fit w-fit gap-x-1 items-center rounded-full px-2 py-0.5 text-sm',
  {
    variants: {
      variant: {
        countdown: 'bg-secondary/80 text-secondary-foreground/80',
        yes: 'bg-success-background/60 text-success-foreground',
        no: 'bg-destructive-background/60 text-destructive-foreground',
        action: 'bg-primary-highlight/50 text-success-foreground',
      },
    },
    defaultVariants: {
      variant: 'countdown',
    },
  }
);

const proposalTagIcon = {
  countdown: <HiOutlineClock className="h-4 w-4 shrink-0" />,
  yes: <HiOutlineHandThumbUp className="h-4 w-4 shrink-0" />,
  no: <HiOutlineHandThumbDown className="h-4 w-4 shrink-0" />,
  mint: <HiOutlineCircleStack className="h-4 w-4 shrink-0" />,
  withdraw: <HiOutlineBanknotes className="h-4 w-4 shrink-0" />,
  change: <HiOutlineCog className="h-4 w-4 shrink-0" />,
  merge: <FaGithub className="h-4 w-4 shrink-0" />,
};

export interface ProposalTagProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof proposalTagVariants> {
  icon?: 'mint' | 'withdraw' | 'merge' | 'countdown' | 'yes' | 'no' | 'change';
}

/**
 * @returns A pill shaped tag showing some information about a proposal, in the given style variant
 */
const ProposalTag = ({
  className,
  variant,
  children,
  icon,
  ...props
}: ProposalTagProps) => {
  return (
    <div {...props} className={cn(proposalTagVariants({ variant }), className)}>
      {proposalTagIcon[(icon || variant) as keyof typeof proposalTagIcon]}
      <div className="break-inside-avoid">{children}</div>
    </div>
  );
};

export default ProposalTag;
