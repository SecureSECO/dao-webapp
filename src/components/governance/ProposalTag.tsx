/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  actionToName,
  calcBigNumberPercentage,
  cn,
  countdownText,
} from '@/src/lib/utils';
import { Proposal, ProposalStatus } from '@plopmenz/diamond-governance-sdk';
import { cva, VariantProps } from 'class-variance-authority';
import { BigNumber } from 'ethers';
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
        action:
          'bg-primary-highlight/40 dark:bg-primary-highlight/60 text-success-foreground',
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

/**
 * Find the data for tags of a specific proposal
 * @example A pending proposal will have two countdown tags, one for when it starts and another for when it ends
 * @param proposal Proposal to extract the tags for
 * @returns A list of props for the ProposalTag component
 */
export const getProposalTags = (
  proposal: Proposal,
  totalVotingWeight: BigNumber
) => {
  const res: ProposalTagProps[] = [];

  if (proposal.status === ProposalStatus.Pending)
    res.push(
      {
        children: 'Starts in ' + countdownText(proposal.startDate),
        variant: 'countdown',
      },
      {
        children: 'Ends in ' + countdownText(proposal.endDate),
        variant: 'countdown',
      }
    );
  else {
    const yesPercentage = calcBigNumberPercentage(
      proposal.data.tally.yes,
      totalVotingWeight
    );
    const noPercentage = calcBigNumberPercentage(
      proposal.data.tally.no,
      totalVotingWeight
    );
    res.push(
      {
        children: yesPercentage.toString() + '%',
        variant: 'yes',
      },
      {
        children: noPercentage.toString() + '%',
        variant: 'no',
      }
    );
  }

  if (proposal.status === ProposalStatus.Active) {
    res.push({
      children: 'Ends in ' + countdownText(proposal.endDate),
      variant: 'countdown',
    });
  }

  // Add tag for each type of action that is attached to the proposal
  const unqiueActions = new Set(proposal.actions.map(actionToName));
  console.log(unqiueActions);

  unqiueActions.forEach((action) => {
    switch (action) {
      case 'mint_tokens':
        res.push({
          children: 'Mint tokens',
          variant: 'action',
          icon: 'mint',
        });
        break;
      case 'withdraw_assets':
        res.push({
          children: 'Withdraw assets',
          variant: 'action',
          icon: 'withdraw',
        });
        break;
      case 'merge_pr':
        res.push({
          children: 'Merge PR',
          variant: 'action',
          icon: 'merge',
        });
        break;
      case 'change_parameter':
        res.push({
          children: 'Change params',
          variant: 'action',
          icon: 'change',
        });
        break;
    }
  });

  return res;
};

export default ProposalTag;
