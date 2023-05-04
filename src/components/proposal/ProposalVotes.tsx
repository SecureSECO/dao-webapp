/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @file ProposalVotes.tsx
 * MainCard component that will show the votes for a proposal, including which addresses voted for specific option in an accordion
 * and allow the user to submit their own vote if the proposal is active (and they are eligible to vote).
 */

import VotesContent from '@/src/components/proposal/VotesContent';
import { Button } from '@/src/components/ui/Button';
import CategoryList, { Category } from '@/src/components/ui/CategoryList';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { DetailedProposal } from '@/src/hooks/useProposal';
import { calcBigintPercentage, cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

interface ProposalVotesProps {
  proposal: DetailedProposal | null;
  loading: boolean;
  refetch: () => void;
  className?: string;
}

/**
 * Get the list of categories that describe the voting details to be passed to the CategoryList component
 * @param proposal The proposal to show the voting details for
 * @returns List of Category objects to be passed to the CategoryList component
 */
const getCategories = (proposal: DetailedProposal | null): Category[] => {
  if (!proposal) return [];

  const currentParticipation = calcBigintPercentage(
    proposal.usedVotingWeight,
    proposal.totalVotingWeight
  );

  const uniqueVoters = proposal.votes.reduce(
    (acc, vote) => acc.add(vote.address),
    new Set<string>()
  ).size;

  return [
    {
      title: 'Decision rules',
      items: [
        {
          label: 'Support threshold',
          value: `${proposal.settings.supportThreshold * 100}%`,
        },
        {
          label: 'Minimum participation',
          value: `${proposal.settings.minParticipation * 100}%`,
        },
      ],
    },
    {
      title: 'Voting activity',
      items: [
        {
          label: 'Current participation',
          value: `${currentParticipation}%`,
        },
        {
          label: 'Unique voters',
          value: uniqueVoters.toString(),
        },
      ],
    },
    {
      title: 'Voting period',
      items: [
        {
          label: 'Start',
          value: format(new Date(proposal.startDate), 'Pp'),
        },
        {
          label: 'End',
          value: format(new Date(proposal.endDate), 'Pp'),
        },
      ],
    },
  ];
};

/**
 * MainCard component showing the votes of a proposal, other details and allowing user to vote (if eligible)
 * @param props.proposal The proposal to show the votes for
 */
const ProposalVotes = ({
  proposal,
  loading,
  refetch,
  className,
}: ProposalVotesProps) => {
  return (
    <MainCard
      loading={loading}
      className={cn(
        'col-span-full flex flex-col gap-y-4 lg:col-span-4',
        className
      )}
      icon={HiChatBubbleLeftRight}
      header={
        <DefaultMainCardHeader
          value={proposal?.votes.length ?? 0}
          label="votes"
        />
      }
      aside={
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="subtle" label="View details" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voting details</DialogTitle>
              <DialogDescription asChild>
                <CategoryList categories={getCategories(proposal)} />
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <div className="flex items-end justify-end">
                <Button variant="subtle" label="Close" className="self-end" />
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
      }
    >
      {proposal && <VotesContent proposal={proposal} refetch={refetch} />}
    </MainCard>
  );
};

export default ProposalVotes;
