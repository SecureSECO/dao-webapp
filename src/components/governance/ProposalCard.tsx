import { Card } from '@/src/components/ui/Card';
import { Address, AddressLength } from '@/src/components/ui//Address';
import Header from '@/src/components/ui/Header';
import { ProposalStatus } from '@aragon/sdk-client';
import { Proposal } from '@/src/hooks/useProposals';
import ProposalTag, {
  ProposalTagProps,
} from '@/src/components/governance/ProposalTag';
import { countdownText } from '@/src/lib/utils';
import { StatusBadge } from '../ui/StatusBadge';

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
    const yesPercentage =
      Number((proposal.result.yes * 10000n) / proposal.totalVotingWeight) / 100;
    const noPercentage =
      Number((proposal.result.no * 10000n) / proposal.totalVotingWeight) / 100;
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
      <StatusBadge status={status} className="xs:hidden" />
      <div className="space-y-2">
        <div className="flex flex-row justify-between">
          <Header level={2}>{title}</Header>
          <StatusBadge status={status} className="hidden xs:flex" />
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
          maxLength={AddressLength.Medium}
          hasLink={true}
          showCopy={true}
        />
      </div>
    </Card>
  );
};

export default ProposalCard;
