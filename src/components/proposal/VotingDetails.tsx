/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @file VotingDetails.tsx
 * Component that displays details regarding the voting process of a proposal.
 * Details shown include: support threhold, minimum participation, current participation, unique voters, start date, and end date
 */

import { DetailedProposal } from '@/src/hooks/useProposal';
import { calcBigintPercentage } from '@/src/lib/utils';
import { format } from 'date-fns';

/**
 * Collection of categories of information about a proposal, te be shown in the VotingDetails component
 * @see VotingDetails for the component that displays these details
 */
const categories = [
  {
    title: 'Decision rules',
    items: [
      {
        label: 'Support threshold',
        value: (proposal: DetailedProposal) =>
          `${proposal.settings.supportThreshold * 100}%`,
      },
      {
        label: 'Minimum participation',
        value: (proposal: DetailedProposal) =>
          `${proposal.settings.minParticipation * 100}%`,
      },
    ],
  },
  {
    title: 'Voting activity',
    items: [
      {
        label: 'Current participation',
        value: (proposal: DetailedProposal) => {
          const currentParticipation = calcBigintPercentage(
            proposal.usedVotingWeight,
            proposal.totalVotingWeight
          );
          return `${currentParticipation}%`;
        },
      },
      {
        label: 'Unique voters',
        value: (proposal: DetailedProposal) => {
          const uniqueVoters = proposal.votes.reduce(
            (acc, vote) => acc.add(vote.address),
            new Set<string>()
          ).size;
          return uniqueVoters;
        },
      },
    ],
  },
  {
    title: 'Voting period',
    items: [
      {
        label: 'Start date',
        value: (proposal: DetailedProposal) =>
          format(new Date(proposal.startDate), 'Pp'),
      },
      {
        label: 'End date',
        value: (proposal: DetailedProposal) =>
          format(new Date(proposal.endDate), 'Pp'),
      },
    ],
  },
];

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

  return (
    <>
      {categories.map((category) => (
        <div key={category.title}>
          <div className="flex flex-row items-center gap-x-2">
            <p className="font-medium dark:text-slate-300">{category.title}</p>
            <div className="mt-1 h-0.5 grow rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          {category.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-row justify-between gap-x-2"
            >
              <p className="text-gray-500 dark:text-slate-400">{item.label}</p>
              <p className="text-primary-300 dark:text-primary-400">
                {item.value(proposal)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default VotingDetails;
