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
import { cn } from '@/src/lib/utils';
import { ProposalStatus } from '@aragon/sdk-client';

/**
 * Extract the milestones of a proposal, depending on its status. The following milestones are returned per status:
 * - PENDING: Published, Pending
 * - ACTIVE: Published, Started, Running
 * - SUCCEEDED: Published, Started, Succeeded, Awaiting execution
 * - DEFEATED: Published, Started, Defeated
 * - EXECUTED: Published, Started, Succeeded, Executed
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
        label: 'Pending',
        variant: 'loading',
        date: proposal.startDate,
      });
      break;
    case ProposalStatus.ACTIVE:
      res.push({
        label: 'Running',
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

/**
 * Shows the history of a proposal, including milestones and dates, in a MainCard
 * @param props.proposal Proposal to show the history of
 * @param props.loading Whether the proposal is loading
 * @returns MainCard component with the history of a proposal
 */
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
      header="History"
    >
      <div className="relative">
        <div className="absolute bottom-6 left-[0.5625rem] top-2 w-0.5 bg-popover-foreground/60" />
        <div className="relative z-10 flex flex-col gap-y-6">
          {proposal &&
            getProposalMilestones(proposal).map((milestone, i) => (
              <ProposalMilestone key={i} {...milestone} className="" />
            ))}
        </div>
      </div>
    </MainCard>
  );
};

export default ProposalHistory;
