/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @file VotesContent.tsx
 * Component that will show the votes for a proposal, including which addresses voted for specific option in an accordion
 * and allow the user to submit their own vote if the proposal is active (and they are eligible to vote).
 */

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { Address } from '@/src/components/ui/Address';
import {
  ConditionalButton,
  ConnectWalletWarning,
  InsufficientRepWarning,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import { Progress } from '@/src/components/ui/Progress';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { CanVote } from '@/src/hooks/useProposal';
import { toast } from '@/src/hooks/useToast';
import { useVotingPower } from '@/src/hooks/useVotingPower';
import { TOKENS } from '@/src/lib/constants/tokens';
import { calcBigNumberPercentage } from '@/src/lib/utils';
import {
  AddressVotes,
  Proposal,
  ProposalStatus,
  VoteOption,
} from '@plopmenz/diamond-governance-sdk';
import { BigNumber } from 'ethers';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';

type VoteFormData = {
  vote_option: string;
};

/**
 * Accordion for the vote values of a proposal, showing the addresses of the voters who voted for each value
 * @param props.proposal The proposal to show the votes for
 * @param props.refetch Function to refetch the proposal data (after submitting vote)
 */
const VotesContent = ({
  proposal,
  votes,
  totalVotingWeight,
  ...props
}: {
  proposal: Proposal;
  votes: AddressVotes[];
  canVote: CanVote;
  totalVotingWeight: BigNumber;
  refetch: () => void;
}) => {
  switch (proposal.status) {
    // Active proposals include radio button to vote
    case ProposalStatus.Active:
      return (
        <VotesContentActive
          proposal={proposal}
          votes={votes}
          totalVotingWeight={totalVotingWeight}
          {...props}
        />
      );
    default:
      return (
        <Accordion type="single" collapsible className="space-y-2 ">
          <VotesContentOption
            proposal={proposal}
            votes={votes}
            voteOption={VoteOption.Yes}
            totalVotingWeight={totalVotingWeight}
          />
          <VotesContentOption
            proposal={proposal}
            votes={votes}
            voteOption={VoteOption.No}
            totalVotingWeight={totalVotingWeight}
          />
          <VotesContentOption
            proposal={proposal}
            votes={votes}
            voteOption={VoteOption.Abstain}
            totalVotingWeight={totalVotingWeight}
          />
        </Accordion>
      );
  }
};

type VoteOptionString = 'Yes' | 'No' | 'Abstain';
type VoteOptionStringLower = 'yes' | 'no' | 'abstain';

/**
 * VotesContent specific to active proposals, which allows the user to vote
 * @see VotesContent
 */
const VotesContentActive = ({
  proposal,
  votes,
  totalVotingWeight,
  canVote,
  refetch,
}: {
  proposal: Proposal;
  votes: AddressVotes[];
  totalVotingWeight: BigNumber;
  canVote: CanVote;
  refetch: () => void;
}) => {
  const { handleSubmit, watch, control } = useForm<VoteFormData>();
  const { isConnected, address } = useAccount();
  const [isVoting, setIsVoting] = useState(false);
  const { getProposalVotingPower, votingPower } = useVotingPower({
    address,
  });
  const hasVoted = votes.some((v) => v.address === address);

  const onSubmitVote: SubmitHandler<VoteFormData> = async (data) => {
    try {
      // Fetch most recent voting power, to vote with all available rep
      const votingPower = await getProposalVotingPower(proposal);
      if (votingPower.lte(0)) {
        return toast.error({
          title: 'You do not have any voting power',
        });
      }
      setIsVoting(true);
      toast.contractTransaction(
        () =>
          proposal.Vote(
            VoteOption[data.vote_option as VoteOptionString],
            votingPower
          ),
        {
          error: 'Error submitting vote',
          success: 'Vote submitted!',
          onSuccess: () => refetch(),
          onFinish: () => setIsVoting(false),
        }
      );
    } catch (e) {
      console.error(e);
      toast.error({
        title: 'Error submitting vote',
        description: 'Unable to get voting power',
      });
    }
  };

  const voteOption = watch('vote_option');
  const userCanVote: boolean =
    canVote[voteOption as VoteOptionString] && votingPower.gt(0);

  return (
    <form onSubmit={handleSubmit(onSubmitVote)} className="space-y-2">
      <Controller
        control={control}
        defaultValue={VoteOption[VoteOption.Yes]}
        name="vote_option"
        render={({ field: { onChange, name } }) => (
          <RadioGroup
            onChange={onChange}
            defaultValue={VoteOption[VoteOption.Yes]}
            name={name}
          >
            <Accordion type="single" collapsible className="space-y-2">
              <VotesContentOption
                proposal={proposal}
                votes={votes}
                voteOption={VoteOption.Yes}
                totalVotingWeight={totalVotingWeight}
              />
              <VotesContentOption
                proposal={proposal}
                votes={votes}
                voteOption={VoteOption.No}
                totalVotingWeight={totalVotingWeight}
              />
              <VotesContentOption
                proposal={proposal}
                votes={votes}
                voteOption={VoteOption.Abstain}
                totalVotingWeight={totalVotingWeight}
              />
            </Accordion>
          </RadioGroup>
        )}
      />

      {/* Button is disabled if the user cannot vote for the currently selected voting option */}
      <div className="ml-6 flex flex-row items-center gap-x-4">
        <ConditionalButton
          disabled={!userCanVote || isVoting}
          conditions={[
            {
              when: !isConnected,
              content: <ConnectWalletWarning action="to vote" />,
            },
            {
              when: votingPower.lte(0),
              content: <InsufficientRepWarning action="to vote" />,
            },
            {
              when: hasVoted,
              content: (
                <Warning>You have already voted on this proposal</Warning>
              ),
            },
          ]}
          type="submit"
        >
          {hasVoted && isConnected && votingPower.gt(0) ? (
            'Vote submitted'
          ) : (
            <span className="ml-1 inline-block ">
              {'Vote ' + (voteOption ?? 'yes')}
            </span>
          )}
        </ConditionalButton>
      </div>
    </form>
  );
};

/**
 * @returns Accordion (i.e. dropdown) for a specific vote value (e.g. Yes, No, Abstain), the content of which contains the addresses of the voters who voted for that value
 */
const VotesContentOption = ({
  proposal,
  votes,
  voteOption,
  totalVotingWeight,
}: {
  proposal: Proposal;
  votes: AddressVotes[];
  voteOption: VoteOption;
  totalVotingWeight: BigNumber;
}) => {
  const voteValueString = VoteOption[voteOption];

  const voteValueLower = voteValueString.toLowerCase() as VoteOptionStringLower;
  const filteredVotes = votes.filter(
    (vote) => vote.votes[0].option === voteOption
  );
  const voteTally =
    voteOption === VoteOption.Abstain
      ? filteredVotes.reduce(
          (acc, vote) => acc.add(vote.votes[0].amount),
          BigNumber.from(0)
        )
      : proposal.data.tally[voteValueLower];
  const percentage = calcBigNumberPercentage(voteTally, totalVotingWeight);

  return (
    <div className="flex flex-row items-center gap-x-2">
      {proposal.status === ProposalStatus.Active && (
        <RadioGroupItem value={voteValueString} id={voteValueString} />
      )}
      <AccordionItem value={voteValueString}>
        <AccordionTrigger className="flex w-full flex-col gap-y-2">
          <div className="flex w-full flex-row items-center justify-between text-left">
            <p className="col-span-2 lowercase first-letter:capitalize">
              {voteValueString}
            </p>
            <div className="flex flex-row items-center gap-x-4 text-right">
              <TokenAmount
                className="text-popover-foreground/80"
                amount={voteTally}
                tokenDecimals={TOKENS.rep.decimals}
                symbol={TOKENS.rep.symbol}
                displayDecimals={0}
              />
              <p className="w-12 text-right text-primary">{percentage}%</p>
            </div>
          </div>
          <Progress value={percentage} size="sm" />
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 gap-x-4 gap-y-2 pt-2 sm:grid-cols-2">
          {filteredVotes.length > 0 ? (
            filteredVotes.map((vote) => (
              <div
                key={vote.address}
                className="flex flex-row items-center justify-between gap-x-4 rounded-full border border-border px-3 py-1"
              >
                <Address address={vote.address} length="sm" hasLink />
                <div className="flex flex-row items-center gap-x-4 text-right opacity-80">
                  {/* The vote.votes is an array of how much was voted for each option, because the underlying 
                      smart contract implements partial voting, but this is not supported in the web-app
                      meaning realistically, the vote.votes array will only ever have 1 entry */}
                  <TokenAmount
                    className="col-span-3"
                    amount={vote.votes[0].amount}
                    tokenDecimals={TOKENS.rep.decimals}
                    symbol={TOKENS.rep.symbol}
                    displayDecimals={0}
                  />
                  <p>
                    {calcBigNumberPercentage(
                      vote.votes[0].amount,
                      totalVotingWeight
                    )}
                    %
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center italic text-popover-foreground/80">
              No votes
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default VotesContent;
