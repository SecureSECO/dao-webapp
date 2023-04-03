import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { DetailedProposal, useProposal } from '@/src/hooks/useProposal';
import { useParams } from 'react-router';
import { Address } from '@/src/components/ui/Address';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalCard';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { ProposalStatus, VoteValues } from '@aragon/sdk-client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { useForm, SubmitHandler } from 'react-hook-form';

const ViewProposal = () => {
  const { id } = useParams();
  const { proposal, loading, error } = useProposal({ id });

  if (error) return <p>{error}</p>;
  return (
    <div className="grid grid-cols-7 gap-6">
      {(!loading && !proposal) || error ? (
        <HeaderCard
          loading={loading}
          title={error ?? 'Proposal not found'}
          className="col-span-full"
        />
      ) : (
        <>
          <HeaderCard
            loading={loading}
            title={proposal?.metadata.title ?? 'Proposal not found'}
            aside={
              <ProposalStatusBadge
                status={proposal?.status ?? ProposalStatus.PENDING}
                size="md"
              />
            }
            className="col-span-full"
          >
            {proposal && (
              <div className="flex flex-col gap-y-3">
                <p className="text-lg font-medium leading-5 text-slate-500 dark:text-slate-400">
                  {proposal.metadata.summary}
                </p>
                <div className="flex items-center gap-x-1 text-sm">
                  <span className="text-gray-500 dark:text-slate-400">
                    Published by
                  </span>
                  <Address
                    address={proposal.creatorAddress}
                    maxLength={16}
                    hasLink={true}
                    showCopy={false}
                  />
                </div>
              </div>
            )}
          </HeaderCard>

          <Card className="col-span-full flex flex-col gap-y-4 lg:col-span-4">
            <Header level={2}>Votes</Header>
            {proposal &&
              (proposal.status === ProposalStatus.ACTIVE ? (
                <VotesContentActive proposal={proposal} />
              ) : (
                <VotesContent proposal={proposal} />
              ))}
          </Card>

          <Card
            loading={loading}
            className="col-span-full lg:col-span-3"
          ></Card>
        </>
      )}
    </div>
  );
};

type VoteFormData = {
  vote_value: string;
};

/**
 * Accordion for the vote values of a proposal, showing the addresses of the voters who voted for each value
 */
const VotesContent = ({ proposal }: { proposal: DetailedProposal }) => {
  // Accordion for each vote value
  return (
    <Accordion type="single" collapsible className="space-y-2">
      <VoteOption proposal={proposal} voteValue={VoteValues.YES} />
      <VoteOption proposal={proposal} voteValue={VoteValues.NO} />
      <VoteOption proposal={proposal} voteValue={VoteValues.ABSTAIN} />
    </Accordion>
  );
};

/**
 * Same as VotesContent, but specific to active proposals, which allows the user to vote
 * @see VotesContent
 */
const VotesContentActive = ({ proposal }: { proposal: DetailedProposal }) => {
  const { register, handleSubmit } = useForm<VoteFormData>();
  const onSubmitVote: SubmitHandler<VoteFormData> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitVote)} className="space-y-2">
      <RadioGroup
        // defaultValue={VoteValues[VoteValues.YES]}
        {...register('vote_value', { required: true })}
      >
        <Accordion type="single" collapsible className="space-y-2">
          <VoteOption proposal={proposal} voteValue={VoteValues.YES} />
          <VoteOption proposal={proposal} voteValue={VoteValues.NO} />
          <VoteOption proposal={proposal} voteValue={VoteValues.ABSTAIN} />
        </Accordion>
      </RadioGroup>
      <Button label="Vote now" type="submit" onClick={() => false} />
    </form>
  );
};

type VoteValueString = 'yes' | 'no' | 'abstain';

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
      <AccordionItem value={voteValueString}>
        <AccordionTrigger className="flex w-full flex-col gap-y-2">
          <div className="flex w-full flex-row items-center justify-between text-left">
            <p className="col-span-2 lowercase first-letter:capitalize">
              {voteValueString}
            </p>
            <div className="flex flex-row items-center gap-x-4 text-right">
              {/* TODO: use toAbbreviatedTokenAmount */}
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
                  maxLength={14}
                  hasLink={true}
                  showCopy={false}
                  replaceYou={false}
                />
                <div className="grid grid-cols-2 text-right">
                  <p className="text-gray-500 ">
                    {/* TODO: use toAbbreviatedTokenAmount */}
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
      {proposal.status === ProposalStatus.ACTIVE && (
        <RadioGroupItem value={voteValueString} id={voteValueString} />
      )}
    </div>
  );
};

export default ViewProposal;
