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
import toast from 'react-hot-toast';
import { useState } from 'react';

type VoteFormData = {
  vote_value: string;
};

/**
 * Accordion for the vote values of a proposal, showing the addresses of the voters who voted for each value
 */
const VotesContent = ({ proposal }: { proposal: DetailedProposal }) => {
  switch (proposal.status) {
    // Active proposals include radio button to vote
    case ProposalStatus.ACTIVE:
      return <VotesContentActive proposal={proposal} />;
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
const VotesContentActive = ({ proposal }: { proposal: DetailedProposal }) => {
  const { handleSubmit, watch, control } = useForm<VoteFormData>();
  const { address } = useAccount();
  const { canVote, loading, error } = useCanVote({
    proposalId: proposal.id,
    address,
  });
  const { votingClient } = useAragonSDKContext();
  const { open } = useWeb3Modal();
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  // Send the vote to SDK
  const confirmVote = async (vote: number) => {
    if (!votingClient) return;
    const steps = votingClient.methods.voteProposal({
      proposalId: proposal.id,
      vote,
    });
    for await (const step of steps) {
      try {
        switch (step.key) {
          case VoteProposalStep.VOTING:
            setAwaitingConfirm(true);
            break;
          case VoteProposalStep.DONE:
            setAwaitingConfirm(false);
            break;
        }
      } catch (err) {
        setAwaitingConfirm(false);
        console.error(err);
      }
    }
  };

  const onSubmitVote: SubmitHandler<VoteFormData> = async (data) => {
    if (!votingClient) return;
    toast.promise(
      confirmVote(VoteValues[data.vote_value as VoteValueStringUpper]),
      {
        loading: awaitingConfirm
          ? 'Awaiting confirmation...'
          : 'Awaiting signature...',
        success: 'Vote submitted!',
        error: 'Error submitting vote',
      }
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
          {!userCanVote && address ? (
            'submitted'
          ) : (
            <span className="ml-1 inline-block lowercase">
              {voteValue ?? 'yes'}
            </span>
          )}
        </Button>
        {!address && (
          <div className="flex flex-row items-center gap-x-1 text-slate-500 dark:text-slate-400">
            <HiOutlineExclamationCircle className="h-5 w-5" />
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
  const percentage =
    Number(
      (proposal.result[voteValueLower] * 10000n) / proposal.totalVotingWeight
    ) / 100;

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
                {Number(proposal.result[voteValueLower]) / 10 ** 18} REP
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
                    {Number(vote.weight) / 10 ** 18} REP
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {Number(
                      (vote.weight * 10000n) / proposal.totalVotingWeight
                    ) / 100}
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
