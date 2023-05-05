/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import { Address, AddressLength } from '@/src/components/ui//Address';
import Header from '@/src/components/ui/Header';
import { ProposalStatus } from '@aragon/sdk-client';
import { Proposal } from '@/src/hooks/useProposals';
import ProposalTag, {
  ProposalTagProps,
} from '@/src/components/governance/ProposalTag';
import { calcBigintPercentage, countdownText } from '@/src/lib/utils';
import { StatusBadge, StatusBadgeProps } from '@/src/components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { HiChevronRight, HiOutlineClock, HiXMark } from 'react-icons/hi2';
import Activity from '@/src/components/icons/Activity';
import Check from '@/src/components/icons/Check';
import DoubleCheck from '@/src/components/icons/DoubleCheck';

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
type ProposalStatusVariant =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

interface ProposalStatusBadgeProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {
  status: ProposalStatus | ProposalStatusVariant;
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
  const statusString = status.toString() as ProposalStatusVariant;
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
  else {
    const yesPercentage = calcBigintPercentage(
      proposal.result.yes,
      proposal.totalVotingWeight
    );
    const noPercentage = calcBigintPercentage(
      proposal.result.no,
      proposal.totalVotingWeight
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

  if (proposal.status === ProposalStatus.ACTIVE) {
    res.push({
      children: 'Ends in ' + countdownText(proposal.endDate),
      variant: 'countdown',
    });
  }
  return res;
};

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const {
    metadata: { title, summary },
    status,
    creatorAddress,
  } = proposal;

  return (
    <Card variant="light" className="space-y-2 font-normal">
      <div className="flex flex-col gap-y-2">
        <ProposalStatusBadge status={status} className="xs:hidden" />
        <div className="flex flex-row justify-between">
          <Link
            to={`/governance/proposals/${proposal.id}`}
            className="flex flex-row items-center gap-x-2 rounded-sm ring-ring ring-offset-2 ring-offset-background hover:underline focus:outline-none focus:ring-1"
          >
            <Header level={2}>{title}</Header>
            <HiChevronRight className="h-5 w-5" />
          </Link>
          <ProposalStatusBadge status={status} className="hidden xs:flex" />
        </div>
        <p className="leading-5 text-popover-foreground/80">{summary}</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {getProposalTags(proposal).map((tagProps, i) => (
          <ProposalTag key={i} {...tagProps} />
        ))}
      </div>
      <div className="flex items-center gap-x-1 text-xs text-popover-foreground/60">
        <span>Published by</span>
        <Address
          address={creatorAddress}
          maxLength={AddressLength.Medium}
          hasLink={true}
          showCopy={true}
        />
      </div>
    </Card>
  );
};

export default ProposalCard;
