/**
 * @file VotesContent.tsx
 * Component that will show the votes for a proposal, including which addresses voted for specific option in an accordion
 * and allow the user to submit their own vote if the proposal is active (and they are eligible to vote).
 */

import { DetailedProposal } from '@/src/hooks/useProposal';
import {
  ProposalStatus,
  VoteProposalStep,
  VoteValues,
} from '@aragon/sdk-client';
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
import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { useCanVote } from '@/src/hooks/useCanVote';
import { useAccount } from 'wagmi';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { useWeb3Modal } from '@web3modal/react';
import {
  CHAIN_METADATA,
  getChainDataByChainId,
} from '@/src/lib/constants/chains';
import { calcBigintPercentage } from '@/src/lib/utils';
import { toAbbreviatedTokenAmount } from '@/src/components/ui/TokenAmount/TokenAmount';
import { ToastUpdate, useToast } from '@/src/hooks/useToast';
import { useEffect } from 'react';

type VoteFormData = {
  vote_value: string;
};

/**
 * Accordion for the vote values of a proposal, showing the addresses of the voters who voted for each value
 * @param props.proposal The proposal to show the votes for
 * @param props.refetch Function to refetch the proposal data (after submitting vote)
 */
const VotesContent = ({
  proposal,
  refetch,
}: {
  proposal: DetailedProposal;
  refetch: () => void;
}) => {
  switch (proposal.status) {
    // Active proposals include radio button to vote
    case ProposalStatus.ACTIVE:
      return <VotesContentActive proposal={proposal} refetch={refetch} />;
    default:
      return (
        <Accordion type="single" collapsible className="space-y-2">
          <VoteOption proposal={proposal} voteValue={VoteValues.YES} />
          <VoteOption proposal={proposal} voteValue={VoteValues.NO} />
          <VoteOption proposal={proposal} voteValue={VoteValues.ABSTAIN} />
        </Accordion>
      );
  }
};

type VoteValueString = 'yes' | 'no' | 'abstain';
type VoteValueStringUpper = 'YES' | 'NO' | 'ABSTAIN';

/**
 * VotesContent specific to active proposals, which allows the user to vote
 * @see VotesContent
 */
const VotesContentActive = ({
  proposal,
  refetch,
}: {
  proposal: DetailedProposal;
  refetch: () => void;
}) => {
  const { handleSubmit, watch, control } = useForm<VoteFormData>();
  const { address } = useAccount();
  const {
    canVote,
    loading,
    error,
    refetch: refetchCanVote,
  } = useCanVote({
    proposalId: proposal.id,
    address,
  });
  const { votingClient } = useAragonSDKContext();
  const { open } = useWeb3Modal();
  const { toast } = useToast();

  // Send the vote to SDK
  const confirmVote = async (
    vote: number,
    updateToast: (props: ToastUpdate) => void
  ) => {
    if (!votingClient) return;
    try {
      const steps = votingClient.methods.voteProposal({
        proposalId: proposal.id,
        vote,
      });

      // Get etherscan url for the currently preferred network
      // Use +chainId to convert string to number
      const chainId = import.meta.env.VITE_PREFERRED_NETWORK_ID;
      const etherscanURL = getChainDataByChainId(+chainId)?.explorer;

      for await (const step of steps) {
        try {
          console.log('step', step);

          switch (step.key) {
            case VoteProposalStep.VOTING:
              // Show link to transaction on etherscan
              updateToast({
                title: 'Awaiting confirmation...',
                description: (
                  <a
                    href={`${etherscanURL}/tx/${step.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary"
                  >
                    View on etherscan
                  </a>
                ),
              });
              break;
            case VoteProposalStep.DONE:
              updateToast({
                title: 'Vote submitted!',
                description: '',
                variant: 'success',
                duration: 3000,
              });
              break;
          }
        } catch (err) {
          updateToast({
            title: 'Error submitting vote',
            description: '',
            variant: 'error',
            duration: 3000,
          });
          console.error(err);
        }
      }
      // Refetch proposal data after submitting vote to update the number of votes
      refetch();
      refetchCanVote();
    } catch (e) {
      updateToast({
        title: 'Error submitting vote',
        description: '',
        variant: 'error',
        duration: 3000,
      });
    }
  };

  const onSubmitVote: SubmitHandler<VoteFormData> = (data) => {
    if (!votingClient) return;
    const { update: updateToast } = toast({
      duration: Infinity,
      variant: 'loading',
      title: 'Awaiting signature...',
    });
    confirmVote(
      VoteValues[data.vote_value as VoteValueStringUpper],
      updateToast
    );
  };

  const voteValue = watch('vote_value');
  const userCanVote =
    !loading && error === null && canVote[voteValue as VoteValueStringUpper];

  return (
    <form onSubmit={handleSubmit(onSubmitVote)} className="space-y-2">
      <Controller
        control={control}
        defaultValue={VoteValues[VoteValues.YES]}
        name="vote_value"
        render={({ field: { onChange, name } }) => (
          <RadioGroup
            onChange={onChange}
            defaultValue={VoteValues[VoteValues.YES]}
            name={name}
          >
            <Accordion type="single" collapsible className="space-y-2">
              <VoteOption proposal={proposal} voteValue={VoteValues.YES} />
              <VoteOption proposal={proposal} voteValue={VoteValues.NO} />
              <VoteOption proposal={proposal} voteValue={VoteValues.ABSTAIN} />
            </Accordion>
          </RadioGroup>
        )}
      />

      {/* Button is disabled if the user cannot vote for the currently selected voting option */}
      <div className="flex flex-row items-center gap-x-4">
        <Button disabled={!userCanVote || !address} type="submit">
          Vote{' '}
          {!userCanVote && address && !loading ? (
            'submitted'
          ) : (
            <span className="ml-1 inline-block lowercase">
              {voteValue ?? 'yes'}
            </span>
          )}
        </Button>
        {!address && (
          <div className="flex flex-row items-center gap-x-1 text-slate-500 dark:text-slate-400">
            <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
            <p>
              <button
                type="button"
                className="hover:underline"
                onClick={() => open()}
              >
                Connect
              </button>{' '}
              your wallet to vote
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

/**
 * @returns Accordion (i.e. dropdown) for a specific vote value (e.g. Yes, No, Abstain), the content of which contains the addresses of the voters who voted for that value
 */
const VoteOption = ({
  proposal,
  voteValue,
}: {
  proposal: DetailedProposal;
  voteValue: VoteValues;
}) => {
  const voteValueString = VoteValues[voteValue];

  const voteValueLower = voteValueString.toLowerCase() as VoteValueString;
  const votes = proposal.votes.filter((vote) => vote.vote === voteValue);
  const percentage = calcBigintPercentage(
    proposal.result[voteValueLower],
    proposal.totalVotingWeight
  );

  return (
    <div className="flex flex-row items-center gap-x-2">
      {proposal.status === ProposalStatus.ACTIVE && (
        <RadioGroupItem value={voteValueString} id={voteValueString} />
      )}
      <AccordionItem value={voteValueString}>
        <AccordionTrigger className="flex w-full flex-col gap-y-2">
          <div className="flex w-full flex-row items-center justify-between text-left">
            <p className="col-span-2 lowercase first-letter:capitalize">
              {voteValueString}
            </p>
            <div className="flex flex-row items-center gap-x-4 text-right">
              <p className="text-slate-500 dark:text-slate-400">
                {toAbbreviatedTokenAmount(
                  proposal.result[voteValueLower],
                  CHAIN_METADATA.rep.nativeCurrency.decimals,
                  true
                )}{' '}
                REP
              </p>
              <p className="w-12 text-right text-primary-500 dark:text-primary-400">
                {percentage}%
              </p>
            </div>
          </div>
          <Progress value={percentage} size="sm" variant="alt" />
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-2 gap-x-4 gap-y-2">
          {votes.length > 0 ? (
            votes.map((vote) => (
              <div
                key={vote.address}
                className="grid grid-cols-2 items-center gap-x-4 rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700"
              >
                <Address
                  address={vote.address}
                  maxLength={AddressLength.Small}
                  hasLink={true}
                  showCopy={false}
                  replaceYou={false}
                />
                <div className="grid grid-cols-2 text-right">
                  <p className="text-gray-500 ">
                    {toAbbreviatedTokenAmount(
                      vote.weight,
                      CHAIN_METADATA.rep.nativeCurrency.decimals,
                      true
                    )}{' '}
                    REP
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {calcBigintPercentage(
                      vote.weight,
                      proposal.totalVotingWeight
                    )}
                    %
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-slate-400">
              No votes
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default VotesContent;
