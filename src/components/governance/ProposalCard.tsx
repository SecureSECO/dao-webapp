/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import { Address } from '@/src/components/ui//Address';
import Header from '@/src/components/ui/Header';
import ProposalTag, {
  getProposalTags,
} from '@/src/components/governance/ProposalTag';
import { StatusBadge, StatusBadgeProps } from '@/src/components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { HiChevronRight, HiOutlineClock, HiXMark } from 'react-icons/hi2';
import Activity from '@/src/components/icons/Activity';
import Check from '@/src/components/icons/Check';
import DoubleCheck from '@/src/components/icons/DoubleCheck';
import { ProposalStatus, Proposal } from '@plopmenz/diamond-governance-sdk';
import { useTotalVotingWeight } from '@/src/hooks/useTotalVotingWeight';

type StatusBadgePropsMap = {
  Pending: StatusBadgeProps;
  Active: StatusBadgeProps;
  Succeeded: StatusBadgeProps;
  Executed: StatusBadgeProps;
  Defeated: StatusBadgeProps;
};

const statusBadgeProps: StatusBadgePropsMap = {
  Pending: {
    icon: HiOutlineClock,
    variant: 'secondary',
    text: 'Pending',
  },
  Active: {
    icon: Activity,
    variant: 'primary',
    text: 'Active',
  },
  Succeeded: {
    icon: Check,
    variant: 'success',
    text: 'Succeeded',
  },
  Executed: {
    icon: DoubleCheck,
    variant: 'success',
    text: 'Executed',
  },
  Defeated: {
    icon: HiXMark,
    variant: 'destructive',
    text: 'Defeated',
  },
};

// Different types of statuses, as a string rather than an enum
export type ProposalStatusString =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

interface ProposalStatusBadgeProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  status: ProposalStatusString;
  size?: 'sm' | 'md';
}

/**
 * @returns A badge showing the status of a proposal
 * @example Active status will have a blue background and an activity icon
 */
export const ProposalStatusBadge = ({
  status,
  size = 'sm',
  className,
  ...props
}: ProposalStatusBadgeProps) => {
  const statusString = status.toString() as ProposalStatusString;
  const statusProps = statusBadgeProps[statusString];

  return (
    <StatusBadge
      {...statusProps}
      size={size}
      {...props}
      className={className}
    />
  );
};

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const {
    metadata: { title, description },
    status,
    data: { creator },
  } = proposal;
  const { totalVotingWeight } = useTotalVotingWeight({
    blockNumber: proposal.data.parameters.snapshotBlock,
  });

  return (
    <Card variant="light" className="space-y-2 font-normal">
      <div className="relative flex w-full flex-col gap-y-2">
        <ProposalStatusBadge
          status={ProposalStatus[status] as ProposalStatusString}
          className="xs:hidden"
        />
        <div className="relative flex w-full flex-row justify-between">
          <Link
            to={`/governance/proposals/${proposal.id}`}
            className="group flex max-w-full flex-row items-center gap-x-2 rounded-sm ring-ring ring-offset-2 ring-offset-background focus:outline-none focus:ring-1 xs:max-w-[80%]"
          >
            <Header
              level={2}
              className="relative truncate pb-1 group-hover:underline"
            >
              {title}
            </Header>
            <HiChevronRight className="h-5 w-5 shrink-0" />
          </Link>
          <ProposalStatusBadge
            status={ProposalStatus[status] as ProposalStatusString}
            className="hidden xs:flex"
          />
        </div>
        <p className="w-full truncate leading-5 text-popover-foreground/80">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-1">
        {getProposalTags(proposal, totalVotingWeight).map((tagProps, i) => (
          <ProposalTag key={i} {...tagProps} />
        ))}
      </div>
      <div className="flex items-center gap-x-1 text-xs text-popover-foreground/60">
        <span>Published by</span>
        <Address address={creator} hasLink showCopy replaceYou />
      </div>
    </Card>
  );
};

export default ProposalCard;
