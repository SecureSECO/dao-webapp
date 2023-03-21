import Header from '@/src/components/ui/Header';
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

const Governance = () => {
  return (
    <div className="flex flex-col gap-6">
      <HeaderCard
        title="Community"
        aside={
          <Button
            variant="default"
            label="New proposal"
            onClick={() => console.log('New Proposal Clicked')}
          />
        }
      >
        <ProposalTabs />
      </HeaderCard>
    </div>
  );
};

const ProposalTabs = () => {
  const { proposals, loading, error } = useProposals({ useDummyData: true });
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="succeeded">Succeeded</TabsTrigger>
        <TabsTrigger value="executed">Executed</TabsTrigger>
        <TabsTrigger value="defeated">Defeated</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="">
        <div className="grid grid-cols-2 gap-4">
          {proposals?.map((proposal) => {
            return <ProposalCard key={proposal.id} proposal={proposal} />;
          })}
        </div>
      </TabsContent>
      <TabsContent value="pending">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pending proposals are displayed here.
        </p>
      </TabsContent>
      <TabsContent value="active">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Active proposals are displayed here.
        </p>
      </TabsContent>
      <TabsContent value="succeeded">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Succeeded proposals are displayed here.
        </p>
      </TabsContent>
      <TabsContent value="executed">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Executed proposals are displayed here.
        </p>
      </TabsContent>
      <TabsContent value="defeated">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Defeated proposals are displayed here.
        </p>
      </TabsContent>
    </Tabs>
  );
};

const countdownText = (endDate: Date) => {
  if (differenceInHours(endDate, new Date()) > 24) {
    return formatDistanceToNow(endDate, { addSuffix: true });
  } else if (differenceInMinutes(endDate, new Date()) > 60) {
    return `${differenceInHours(endDate, new Date())} hours left`;
  } else if (differenceInMinutes(endDate, new Date()) > 1) {
    return `${differenceInMinutes(endDate, new Date())} minutes left`;
  } else {
    return 'Less than a minute left';
  }
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
    <Card
      padding="sm"
      variant="light"
      className="space-y-2 p-4 dark:bg-slate-700/50"
    >
      <h3 className="text-lg font-bold dark:text-slate-300">{title}</h3>
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
