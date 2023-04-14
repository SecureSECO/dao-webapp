/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import History from '@/src/components/icons/History';
import ProposalMilestone, {
  ProposalMilestoneProps,
} from '@/src/components/proposal/ProposalMilestone';
import { MainCard } from '@/src/components/ui/MainCard';
import { DetailedProposal } from '@/src/hooks/useProposal';
import { ProposalStatus } from '@aragon/sdk-client';

/**
 * Extract the milestones of a proposal, depending on its status
 * @example A pending proposal will have a "Published" milestone and "Awaiting start" milestone
 * @param proposal Proposal to extract milestones from
 * @returns A list of ProposalMilestoneProps to be passed to a ProposalMilestone component
 */
const getProposalMilestones = (proposal: DetailedProposal) => {
  const res: ProposalMilestoneProps[] = [];

  res.push({
    label: 'Published',
    variant: 'done',
    date: proposal.creationDate,
    blockNumber: proposal.creationBlockNumber,
  });

  if (proposal.status !== ProposalStatus.PENDING)
    res.push({
      label: 'Started',
      variant: 'done',
      date: proposal.startDate,
    });

  switch (proposal.status) {
    case ProposalStatus.PENDING:
      res.push({
        label: 'Awaiting start',
        variant: 'loading',
        date: proposal.startDate,
      });
      break;
    case ProposalStatus.ACTIVE:
      res.push({
        label: 'Awaiting voting',
        variant: 'loading',
        date: proposal.endDate,
      });
      break;
    case ProposalStatus.SUCCEEDED:
      res.push({
        label: 'Succeeded',
        variant: 'done',
        date: proposal.endDate,
      });
      if (proposal.actions.length > 0)
        res.push({
          label: 'Awaiting execution',
          variant: 'loading',
        });
      break;
    case ProposalStatus.DEFEATED:
      res.push({
        label: 'Defeated',
        variant: 'failed',
        date: proposal.endDate,
      });
      break;
    case ProposalStatus.EXECUTED:
      res.push(
        {
          label: 'Succeeded',
          variant: 'done',
          date: proposal.endDate,
        },
        {
          label: 'Executed',
          variant: 'executed',
          date: proposal.executionDate,
          blockNumber: proposal.executionBlockNumber,
        }
      );
      break;
  }

  return res;
};

const ProposalHistory = ({
  proposal,
  loading = false,
  className,
}: {
  proposal: DetailedProposal | null;
  loading?: boolean;
  className?: string;
}) => {
  return (
    <MainCard
      loading={loading}
      className={className}
      icon={History}
      header={<p className="text-2xl font-medium">History</p>}
    >
      <div className="flex flex-col gap-y-6">
        {proposal &&
          getProposalMilestones(proposal).map((milestone, i) => (
            <ProposalMilestone key={i} {...milestone} />
          ))}
      </div>
    </MainCard>
  );
};

export default ProposalHistory;
