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

const countdownText = (endDate: Date) => {
  const date = new Date();
  if (differenceInHours(endDate, date) > 24) {
    return formatDistanceToNow(endDate, { addSuffix: true });
  } else if (differenceInMinutes(endDate, date) > 60) {
    return `${differenceInHours(endDate, date)} hours left`;
  } else if (differenceInMinutes(endDate, date) > 1) {
    return `${differenceInMinutes(endDate, date)} minutes left`;
  } else {
    return 'Less than a minute left';
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

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const {
    metadata: { title, summary },
    status,
    endDate,
    startDate,
    creatorAddress,
  } = proposal;

  return (
    <Card padding="sm" variant="light" className="space-y-1 p-4 font-normal">
      <div className="flex flex-row justify-between">
        <Header level={2}>{title}</Header>
        <ProposalStatusBadge status={status} />
      </div>
      <p className="m-0 text-slate-500 dark:text-slate-400">{summary}</p>
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
