import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { DetailedProposal, useProposal } from '@/src/hooks/useProposal';
import { useParams } from 'react-router';
import { Address } from '@/src/components/ui/Address';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalCard';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';

const ViewProposal = () => {
  const { id } = useParams();
  const { proposal, loading, error } = useProposal({ id });

  if (error) return <p>{error}</p>;
  return (
    <div className="grid grid-cols-7 gap-6">
      {!proposal || error ? (
        <HeaderCard
          loading={loading}
          title={error ?? 'Proposal not found'}
          className="col-span-full"
        />
      ) : (
        <>
          <HeaderCard
            loading={loading}
            title={proposal.metadata.title}
            aside={<ProposalStatusBadge status={proposal.status} size="lg" />}
            className="col-span-full"
          >
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
          </HeaderCard>

          <div className="col-span-full lg:col-span-4">
            <VotesCard proposal={proposal} />
          </div>

          <div className="col-span-full lg:col-span-3">
            <Card></Card>
          </div>
        </>
      )}
    </div>
  );
};

const VotesCard = ({ proposal }: { proposal: DetailedProposal }) => {
  return (
    <Card className="flex flex-col gap-y-2">
      <div className="flex flex-row justify-between">
        <Header level={2}>Votes</Header>
      </div>
    </Card>
  );
};

export default ViewProposal;
