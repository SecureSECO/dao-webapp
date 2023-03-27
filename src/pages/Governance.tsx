import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import {
  formatDistanceToNow,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import { Address } from '@/src/components/ui//Address';
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
import Header from '@/src/components/ui/Header';
import { cn } from '@/src/lib/utils';
import { cva } from 'class-variance-authority';

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
  const [direction, setDirection] = useState<SortDirection>(SortDirection.ASC);
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

const countdownText = (endDate: Date) => {
  const date = new Date();
  if (differenceInHours(endDate, date) > 24) {
    return formatDistanceToNow(endDate, { addSuffix: true });
  } else if (differenceInMinutes(endDate, date) > 60) {
    return `${differenceInHours(endDate, date)} hours left`;
  } else if (differenceInMinutes(endDate, date) > 1) {
    return `${differenceInMinutes(endDate, date)} minutes left`;
  } else {
    return 'Less than a minute left';
  }
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

type StatusVariant =
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

const statusVariants = cva('rounded-lg px-2 py-1', {
  variants: {
    status: {
      Pending: 'bg-slate-200',
      Active: 'bg-slate-200',
      Succeeded: 'bg-green-200',
      Executed: 'bg-green-200',
      Defeated: 'bg-red-200',
    },
  },
  defaultVariants: {
    status: 'Pending',
  },
});

export const ProposalStatusBadge = ({ status }: { status: ProposalStatus }) => {
  return (
    <div
      className={cn(
        statusVariants({ status: status.toString() as StatusVariant })
      )}
    >
      <p className="text-sm">{status}</p>
    </div>
  );
};

export const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
  const {
    metadata: { title, summary },
    status,
    endDate,
    startDate,
    creatorAddress,
  } = proposal;

  return (
    <Card padding="sm" variant="light" className="space-y-2 p-4">
      <div className="flex flex-row justify-between">
        <Header level={3}>{title}</Header>
        <ProposalStatusBadge status={status} />
      </div>
      <p className="text-sm text-gray-500 dark:text-slate-400">{summary}</p>
      <p className="font-medium text-gray-800 dark:text-slate-300">
        Status: {status}
      </p>
      <p className="text-sm text-gray-600 dark:text-slate-400">
        End Date: {countdownText(endDate)}
      </p>
      <p className="text-sm text-gray-600 dark:text-slate-400">
        Start Date: {startDate.toLocaleDateString()}
      </p>
      <div className="flex items-center">
        <span className="mr-1 text-sm text-gray-600 dark:text-slate-400">
          Published by:
        </span>
        <Address
          address={creatorAddress}
          maxLength={20}
          hasLink={true}
          showCopy={true}
        />
      </div>
    </Card>
  );
};

export default Governance;
