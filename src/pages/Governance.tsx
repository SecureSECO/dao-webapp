import { Button } from '@/src/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/Tabs';
import { Proposal, useProposals } from '@/src/hooks/useProposals';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useState } from 'react';
import {
  ProposalSortBy,
  ProposalStatus,
  SortDirection,
} from '@aragon/sdk-client';
import SortSelector from '@/src/components/ui/SortSelector';

import ProposalCard from '@/src/components/governance/ProposalCard';

const Governance = () => {
  return (
    <div className="flex flex-col gap-6">
      <HeaderCard
        title="Proposals"
        aside={
          <Button
            variant="default"
            label="New proposal"
            onClick={() => console.log('New Proposal Clicked')}
          />
        }
      ></HeaderCard>
      <ProposalTabs />
    </div>
  );
};

export type ProposalStatusString =
  | 'ALL'
  | 'PENDING'
  | 'ACTIVE'
  | 'SUCCEEDED'
  | 'EXECUTED'
  | 'DEFEATED';

const statusStringToEnum = (
  status: ProposalStatusString
): ProposalStatus | undefined => {
  if (status === 'ALL') return undefined;
  return ProposalStatus[status];
};

const tabs: ProposalStatusString[] = [
  'ALL',
  ...Object.keys(ProposalStatus).map((k) => k as ProposalStatusString),
];

const ProposalTabs = () => {
  const [currentTab, setCurrentTab] = useState<ProposalStatus | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<ProposalSortBy>(
    ProposalSortBy.CREATED_AT
  );
  const [direction, setDirection] = useState<SortDirection | undefined>(
    undefined
  );
  const { proposals, loading, error } = useProposals({
    useDummyData: false,
    status: currentTab,
    sortBy,
    direction,
  });

  return (
    <Tabs
      defaultValue="ALL"
      onValueChange={(v) =>
        setCurrentTab(statusStringToEnum(v as ProposalStatusString))
      }
      variant="default"
    >
      <div className="flex flex-row gap-x-3">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <span className="lowercase first-letter:uppercase">{tab}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <SortSelector setSortBy={setSortBy} setDirection={setDirection} />
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <ProposalCardList
            proposals={proposals}
            loading={loading}
            error={error}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export const ProposalCardList = ({
  proposals,
  loading,
  error,
}: {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
}) => {
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700/50" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700/50" />
      </div>
    );
  if (error)
    return <p className="text-center font-normal">An error was encountered</p>;
  return (
    <div>
      {proposals.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {proposals.map((proposal) => {
            return <ProposalCard key={proposal.id} proposal={proposal} />;
          })}
        </div>
      ) : (
        <p className="text-center font-normal">No proposals found!</p>
      )}
    </div>
  );
};

export default Governance;
