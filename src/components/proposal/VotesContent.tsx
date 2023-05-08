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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';
import { calcBigNumberPercentage } from '@/src/lib/utils';
import { toAbbreviatedTokenAmount } from '@/src/components/ui/TokenAmount';
import { contractTransaction } from '@/src/hooks/useToast';
import ConnectWalletWarning from '@/src/components/ui/ConnectWalletWarning';
import { ProposalStatus, VoteOption } from '@plopmenz/diamond-governance-sdk';
import { Proposal } from '@plopmenz/diamond-governance-sdk/dist/sdk/src/sugar/proposal';
import { CanVote } from '@/src/hooks/useProposal';
import { useTotalVotingWeight } from '@/src/hooks/useTotalVotingWeight';
import { BigNumber } from 'ethers';
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
  ...props
}: {
  proposal: Proposal;
  canVote: CanVote;
  votingPower: BigNumber;
  refetch: () => void;
}) => {
  const { totalVotingWeight } = useTotalVotingWeight({
    blockNumber: proposal.data.parameters.snapshotBlock,
  });

  switch (proposal.status) {
    // Active proposals include radio button to vote
    case ProposalStatus.Active:
      return (
        <VotesContentActive
          proposal={proposal}
          totalVotingWeight={totalVotingWeight}
          {...props}
        />
      );
    default:
      return (
        <Accordion type="single" collapsible className="space-y-2">
          <VotesContentOption
            proposal={proposal}
            voteOption={VoteOption.Yes}
            totalVotingWeight={totalVotingWeight}
          />
          <VotesContentOption
            proposal={proposal}
            voteOption={VoteOption.No}
            totalVotingWeight={totalVotingWeight}
          />
          <VotesContentOption
            proposal={proposal}
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
  totalVotingWeight,
  canVote,
  votingPower,
  refetch,
}: {
  proposal: Proposal;
  totalVotingWeight: BigNumber;
  canVote: CanVote;
  // Voting power (rep balance) of the connected wallet
  votingPower: BigNumber;
  refetch: () => void;
}) => {
  const { handleSubmit, watch, control } = useForm<VoteFormData>();
  const { isConnected } = useAccount();

  const onSubmitVote: SubmitHandler<VoteFormData> = (data) => {
    contractTransaction(
      () =>
        proposal.Vote(
          VoteOption[data.vote_option as VoteOptionString],
          votingPower.toNumber()
        ),
      {
        messages: {
          error: 'Error submitting vote',
          success: 'Vote submitted!',
        },
        onFinish: () => {
          refetch();
        },
      }
    );
  };

  const voteOption = watch('vote_option');
  const userCanVote: boolean = canVote[voteOption as VoteOptionString];

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
                voteOption={VoteOption.Yes}
                totalVotingWeight={totalVotingWeight}
              />
              <VotesContentOption
                proposal={proposal}
                voteOption={VoteOption.No}
                totalVotingWeight={totalVotingWeight}
              />
              <VotesContentOption
                proposal={proposal}
                voteOption={VoteOption.Abstain}
                totalVotingWeight={totalVotingWeight}
              />
            </Accordion>
          </RadioGroup>
        )}
      />

      {/* Button is disabled if the user cannot vote for the currently selected voting option */}
      <div className="flex flex-row items-center gap-x-4">
        <Button disabled={!userCanVote || !isConnected} type="submit">
          Vote{' '}
          {!userCanVote && isConnected ? (
            'submitted'
          ) : (
            <span className="ml-1 inline-block lowercase">
              {voteOption ?? 'yes'}
            </span>
          )}
        </Button>
        {!isConnected && <ConnectWalletWarning action="to vote" />}
      </div>
    </form>
  );
};

/**
 * @returns Accordion (i.e. dropdown) for a specific vote value (e.g. Yes, No, Abstain), the content of which contains the addresses of the voters who voted for that value
 */
const VotesContentOption = ({
  proposal,
  voteOption,
  totalVotingWeight,
}: {
  proposal: Proposal;
  voteOption: VoteOption;
  totalVotingWeight: BigNumber;
}) => {
  const voteValueString = VoteOption[voteOption];

  const voteValueLower = voteValueString.toLowerCase() as VoteOptionStringLower;
  const voteTally = proposal.data.tally[voteValueLower];
  const votes = undefined; //.votes.filter((vote) => vote.vote === voteValue);
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
              <p className="text-popover-foreground/80">
                {toAbbreviatedTokenAmount(
                  voteTally.toBigInt(),
                  CHAIN_METADATA.rep.nativeCurrency.decimals,
                  true
                )}{' '}
                {CHAIN_METADATA.rep.nativeCurrency.symbol}
              </p>
              <p className="w-12 text-right text-primary">{percentage}%</p>
            </div>
          </div>
          <Progress value={percentage} size="sm" />
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {votes.length > 0 ? (
            votes.map((vote) => (
              <div
                key={vote.address}
                className="grid grid-cols-2 items-center gap-x-4 rounded-full border border-border px-3 py-1"
              >
                <Address
                  address={vote.address}
                  maxLength={AddressLength.Small}
                  hasLink={true}
                  showCopy={false}
                  replaceYou={false}
                />
                <div className="grid grid-cols-2 text-right opacity-80">
                  <p>
                    {toAbbreviatedTokenAmount(
                      vote.weight,
                      CHAIN_METADATA.rep.nativeCurrency.decimals,
                      true
                    )}{' '}
                    {CHAIN_METADATA.rep.nativeCurrency.symbol}
                  </p>
                  <p>
                    {calcBigNumberPercentage(vote.weight, totalVotingWeight)}%
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
