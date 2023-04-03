import { Card } from '@/src/components/ui/Card';
import { Address } from '@/src/components/ui//Address';
import Header from '@/src/components/ui/Header';
import { cn } from '@/src/lib/utils';
import { cva } from 'class-variance-authority';
import DoubleCheck from '@/src/components/icons/DoubleCheck';
import Check from '@/src/components/icons/Check';
import { ProposalStatus } from '@aragon/sdk-client';
import { Proposal } from '@/src/hooks/useProposals';
import { HiChevronRight, HiOutlineClock, HiXMark } from 'react-icons/hi2';
import Activity from '@/src/components/icons/Actitivy';
import ProposalTag, {
  ProposalTagProps,
} from '@/src/components/governance/ProposalTag';
import { countdownText } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

// Different types of statuses a proposal can have, as a string rather than an enum
type StatusVariant =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

const statusVariants = cva(
  'rounded-lg flex flex-row w-fit gap-x-1 items-center h-fit',
  {
    variants: {
      status: {
        Pending: 'bg-slate-200 dark:bg-slate-600',
        Active: 'bg-primary-200 dark:bg-primary-400 dark:text-slate-900',
        Succeeded: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Executed: 'bg-green-200 dark:bg-green-300 dark:text-slate-900',
        Defeated: 'bg-red-200 dark:bg-red-300 dark:text-slate-900',
      },
      size: {
        sm: 'text-sm px-2 py-1 gap-x-1',
        md: 'text-lg px-3 py-1 gap-x-2',
        lg: 'text-xl px-4 py-2 gap-x-3',
      },
    },
    defaultVariants: {
      status: 'Pending',
      size: 'sm',
    },
  }
);

const statusIconVariants = cva('', {
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

const statusIcon = (
  status: StatusVariant,
  size: 'sm' | 'md' | 'lg' | undefined
) => {
  switch (status) {
    case 'Pending':
      return <HiOutlineClock className={cn(statusIconVariants({ size }))} />;
    case 'Active':
      return <Activity className={cn(statusIconVariants({ size }))} />;
    case 'Succeeded':
      return <Check className={cn(statusIconVariants({ size }))} />;
    case 'Executed':
      return <DoubleCheck className={cn(statusIconVariants({ size }))} />;
    case 'Defeated':
      return <HiXMark className={cn(statusIconVariants({ size }))} />;
  }
};

interface ProposalStatusBadgeProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  status: ProposalStatus;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * @returns A badge showing a proposal status
 * @example Active status will have a blue background and an activity icon
 */
export const ProposalStatusBadge = ({
  status,
  size,
  className,
  ...props
}: ProposalStatusBadgeProps) => {
  const statusString = status.toString() as StatusVariant;

  return (
    <div
      className={cn(statusVariants({ status: statusString, size }), className)}
      {...props}
    >
      {statusIcon(statusString, size)}
      <p>{status}</p>
    </div>
  );
};

/**
 * Find the data for tags of a specific proposal
 * @example A pending proposal will have two countdown tags, one for when it starts and another for when it ends
 * @param proposal Proposal to extract the tags for
 * @returns A list of props for the ProposalTag component
 */
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
      <ProposalStatusBadge status={status} className="xs:hidden" />
      <div className="space-y-2">
        <div className="flex flex-row justify-between">
          <Link
            to={`/governance/proposals/${proposal.id}`}
            className="flex flex-row items-end gap-x-2 hover:underline"
          >
            <Header level={2}>{title}</Header>
            <HiChevronRight className="h-5 w-5" />
          </Link>
          <ProposalStatusBadge status={status} className="hidden xs:flex" />
        </div>
        <p className="leading-5 text-slate-500 dark:text-slate-400">
          {summary}
        </p>
      </div>
      <div className="flex flex-wrap gap-1">
        {getProposalTags(proposal).map((tagProps, i) => (
          <ProposalTag key={i} {...tagProps} />
        ))}
      </div>
      <div className="flex items-center gap-x-1 text-xs">
        <span className="text-gray-500 dark:text-slate-400">Published by</span>
        <Address
          address={creatorAddress}
          maxLength={16}
          hasLink={true}
          showCopy={true}
        />
      </div>
    </Card>
  );
};

export default ProposalCard;
