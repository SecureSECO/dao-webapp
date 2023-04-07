import { DetailedProposal } from '@/src/hooks/useProposal';
import { format } from 'date-fns';

/**
 * @returns Collection of div elements that display details regarding the voting process of the given proposal
 */
const VotingDetails = ({ proposal }: { proposal: DetailedProposal | null }) => {
  if (!proposal)
    return (
      <p className="text-center text-gray-500 dark:text-slate-400">
        Proposal details not found
      </p>
    );

  const currentParticipation =
    Number((proposal.usedVotingWeight * 10000n) / proposal.totalVotingWeight) /
    100;
  const uniqueVoters = proposal.votes.reduce(
    (acc, vote) => acc.add(vote.address),
    new Set<string>()
  ).size;

  return (
    <>
      <div>
        <div className="flex flex-row items-center gap-x-2">
          <p className="font-medium">Decision rules</p>
          <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="flex flex-row justify-between gap-x-2">
          <p className="text-gray-500 dark:text-slate-400">Support threshold</p>
          <p className="text-primary-300 dark:text-primary-400">
            {proposal.settings.supportThreshold * 100}%
          </p>
        </div>
        <div className="flex flex-row justify-between gap-x-2">
          <p className="text-gray-500 dark:text-slate-400">
            Minimum participation
          </p>
          <p className="text-primary-300 dark:text-primary-400">
            {proposal.settings.minParticipation * 100}%
          </p>
        </div>
      </div>

      <div>
        <div className="flex flex-row items-center gap-x-2">
          <p className="font-medium">Voting activity</p>
          <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="flex flex-row justify-between gap-x-2">
          <p className="text-gray-500 dark:text-slate-400">
            Current participation
          </p>
          <p className="text-primary-300 dark:text-primary-400">
            {currentParticipation}%
          </p>
        </div>
        <div className="flex flex-row justify-between gap-x-2">
          <p className="text-gray-500 dark:text-slate-400">Unique voters</p>
          <p className="text-primary-300 dark:text-primary-400">
            {uniqueVoters}
          </p>
        </div>
      </div>

      <div>
        <div className="flex flex-row items-center gap-x-2">
          <p className="font-medium">Duration</p>
          <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="flex flex-row justify-between gap-x-2">
          <p className="text-gray-500 dark:text-slate-400">Start</p>
          <p className="text-primary-300 dark:text-primary-400">
            {format(proposal.startDate, 'Pp')}
          </p>
        </div>
        <div className="flex flex-row justify-between gap-x-2">
          <p className="text-gray-500 dark:text-slate-400">End</p>
          <p className="text-primary-300 dark:text-primary-400">
            {format(proposal.endDate, 'Pp')}
          </p>
        </div>
      </div>
    </>
  );
};

export default VotingDetails;
