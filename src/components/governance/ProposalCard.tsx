import { Card } from '@/src/components/ui/Card';
import {
  formatDistanceToNow,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import { Address } from '@/src/components/ui//Address';
import Header from '@/src/components/ui/Header';
import { cn } from '@/src/lib/utils';
import { cva } from 'class-variance-authority';
import DoubleCheck from '@/src/components/icons/DoubleCheck';
import Check from '@/src/components/icons/Check';
import { ProposalStatus } from '@aragon/sdk-client';
import { Proposal } from '@/src/hooks/useProposals';
import { HiOutlineClock, HiXMark } from 'react-icons/hi2';
import Activity from '@/src/components/icons/Actitivy';
import ProposalTag, {
  ProposalTagProps,
} from '@/src/components/governance/ProposalTag';

const countdownText = (date: Date) => {
  const now = new Date();
  if (differenceInHours(date, now) > 24) {
    return formatDistanceToNow(date);
  } else if (differenceInMinutes(date, now) > 60) {
    return `${differenceInHours(date, now)} hours`;
  } else if (differenceInMinutes(date, now) > 1) {
    return `${differenceInMinutes(date, now)} minutes`;
  } else {
    return 'less than a minute';
  }
};

type StatusVariant =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

const statusVariants = cva(
  'rounded-lg px-2 py-1 flex flex-row gap-x-1 items-center h-fit',
  {
    variants: {
      status: {
        Pending: 'bg-slate-200 dark:bg-slate-600',
        Active: 'bg-primary-200 dark:bg-primary-400 dark:text-slate-900',
        Succeeded: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Executed: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Defeated: 'bg-red-200 dark:bg-red-300 dark:text-slate-900',
      },
    },
    defaultVariants: {
      status: 'Pending',
    },
  }
);

const statusIcon = {
  Pending: <HiOutlineClock className="h-4 w-4" />,
  Active: <Activity className="h-4 w-4" />,
  Succeeded: <Check className="h-4 w-4" />,
  Executed: <DoubleCheck className="h-4 w-4" />,
  Defeated: <HiXMark className="h-4 w-4" />,
};

export const ProposalStatusBadge = ({ status }: { status: ProposalStatus }) => {
  const statusString = status.toString() as StatusVariant;
  return (
    <div className={cn(statusVariants({ status: statusString }))}>
      {statusIcon[statusString]}
      <p className="text-sm">{status}</p>
    </div>
  );
};

const getProposalTags = (proposal: Proposal) => {
  const res: ProposalTagProps[] = [];
  if (proposal.status === ProposalStatus.PENDING)
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
  if (proposal.status === ProposalStatus.ACTIVE) {
    const yesPercentage =
      Number((proposal.result.yes * 10000n) / proposal.totalVotingWeight) / 100;
    const noPercentage =
      Number((proposal.result.no * 10000n) / proposal.totalVotingWeight) / 100;
    res.push(
      {
        children: 'Ends in ' + countdownText(proposal.endDate),
        variant: 'countdown',
      },
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

  // TODO: add tag for type of proposal (when we add support for different types)
  return res;
};

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const {
    metadata: { title, summary },
    status,
    creatorAddress,
  } = proposal;

  return (
    <Card padding="sm" variant="light" className="space-y-2 p-4 font-normal">
      <div className="space-y-1">
        <div className="flex flex-row justify-between">
          <Header level={2}>{title}</Header>
          <ProposalStatusBadge status={status} />
        </div>
        <p className="m-0 text-slate-500 dark:text-slate-400">{summary}</p>
      </div>
      <div className="flex flex-row gap-x-2">
        {getProposalTags(proposal).map((tagProps, i) => (
          <ProposalTag key={i} {...tagProps} />
        ))}
      </div>
      <div className="flex items-center gap-x-1 text-xs">
        <span className="text-gray-500 dark:text-slate-400">Published by</span>
        <Address
          address={creatorAddress}
          maxLength={20}
          hasLink={true}
          showCopy={true}
        />
      </div>
    </Card>
  );
};

export default ProposalCard;
