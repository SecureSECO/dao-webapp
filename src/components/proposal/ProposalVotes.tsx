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
import VotingDetails from '@/src/components/proposal/VotingDetails';
import { Button } from '@/src/components/ui/Button';
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
import { cn } from '@/src/lib/utils';
import React from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

interface ProposalVotesProps {
  proposal: DetailedProposal | null;
  loading: boolean;
  refetch: () => void;
  className?: string;
}

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
                <div className="flex flex-col gap-y-4">
                  <VotingDetails proposal={proposal} />
                </div>
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
