import { cva } from 'class-variance-authority';
import DoubleCheck from '@/src/components/icons/DoubleCheck';
import Check from '@/src/components/icons/Check';
import { ProposalStatus } from '@aragon/sdk-client';
import { Proposal } from '@/src/hooks/useProposals';
import { HiOutlineClock, HiXMark } from 'react-icons/hi2';
import Activity from '@/src/components/icons/Actitivy';
import { cn } from '@/src/lib/utils';
import { FaHourglass } from 'react-icons/fa';
import { AiFillHourglass } from 'react-icons/ai';

const statusVariants = cva(
  'rounded-lg px-2 py-1 flex flex-row w-fit gap-x-1 items-center h-fit',
  {
    variants: {
      status: {
        Pending: 'bg-slate-200 dark:bg-slate-600',
        Active: 'bg-primary-200 dark:bg-primary-400 dark:text-slate-900',
        Succeeded: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Executed: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Defeated: 'bg-red-200 dark:bg-red-300 dark:text-slate-900',
        Verified: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Expired: 'bg-red-200 dark:bg-slate-600',
        Unverified: 'bg-slate-200 dark:bg-slate-600',
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
  Verified: <DoubleCheck className="h-4 w-4" />,
  Expired: <AiFillHourglass className="h-4 w-4" />,
  Unverified: <HiXMark className="h-4 w-4" />,
};

// Different types of statuses, as a string rather than an enum
type StatusVariant =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated'
  | 'Verified'
  | 'Expired'
  | 'Unverified';

interface ProposalStatusBadgeProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  status: ProposalStatus | StatusVariant;
}

/**
 * @returns A badge with some status
 * @example Active status will have a blue background and an activity icon
 */
export const StatusBadge = ({
  status,
  className,
  ...props
}: ProposalStatusBadgeProps) => {
  const statusString = status.toString() as StatusVariant;
  return (
    <div
      className={cn(statusVariants({ status: statusString }), className)}
      {...props}
    >
      {statusIcon[statusString]}
      <p className="text-sm">{status}</p>
    </div>
  );
};
