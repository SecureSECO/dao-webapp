import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useProposal } from '@/src/hooks/useProposal';
import { useParams } from 'react-router';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalCard';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { ProposalStatus } from '@aragon/sdk-client';
import VotesContent from '@/src/components/proposal/VotesContent';

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
                    maxLength={AddressLength.Medium}
                    hasLink={true}
                    showCopy={false}
                  />
                </div>
              </div>
            )}
          </HeaderCard>

          <Card className="col-span-full flex flex-col gap-y-4 lg:col-span-4">
            <Header level={2}>Votes</Header>
            {proposal && <VotesContent proposal={proposal} />}
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

export default ViewProposal;
