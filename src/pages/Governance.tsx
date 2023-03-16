import Header from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/Tabs';

const Governance = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col justify-between gap-y-8">
        <div className="flex w-full items-center justify-between gap-y-6">
          <Header>Proposals</Header>
          <Button
            variant="default"
            label="New proposal"
            onClick={() => console.log('New Proposal Clicked')}
          />
        </div>
      </Card>
      <ProposalTabs />
    </div>
  );
};

const ProposalTabs = () => {
  return (
    <Tabs defaultValue="all" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="succeeded">Succeeded</TabsTrigger>
        <TabsTrigger value="executed">Executed</TabsTrigger>
        <TabsTrigger value="defeated">Defeated</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All proposals are displayed here.
        </p>
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

import React from 'react';

export const ProposalCard = () => {
  return (
    <Card padding="sm" variant="light">
      ProposalCard
    </Card>
  );
};

export default Governance;
