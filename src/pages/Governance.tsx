import Header from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/Tabs';

type DAO = {
  address: string;
  name: string;
};

type Metadata = {
  title: string;
  summary: string;
};

type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

type Results = {
  yes: bigint;
  no: bigint;
  abstain: bigint;
};

type Proposal = {
  id: string;
  dao: DAO;
  creatorAddress: string;
  metadata: Metadata;
  startDate: Date;
  endDate: Date;
  status: 'Executed' | 'Pending';
  token: Token;
  results: Results;
};

type ProposalsType = {
  proposals: Proposal[];
};

const fallbackProposals: ProposalsType = {
  proposals: [
    {
      id: '0x12345...',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal',
        summary: 'Test Proposal Summary',
      },
      startDate: new Date('2023-03-16T00:00:00.000Z'),
      endDate: new Date('2023-03-23T00:00:00.000Z'),
      status: 'Executed',
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
      },
      results: {
        yes: 100000n,
        no: 77777n,
        abstain: 0n,
      },
    },
    {
      id: '0x12345...',
      dao: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'Cool DAO',
      },
      creatorAddress: '0x1234567890123456789012345678901234567890',
      metadata: {
        title: 'Test Proposal 2',
        summary: 'Test Proposal Summary 2',
      },
      startDate: new Date('2023-03-16T00:00:00.000Z'),
      endDate: new Date('2023-03-23T00:00:00.000Z'),
      status: 'Pending',
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
      },
      results: {
        yes: 100000n,
        no: 77777n,
        abstain: 0n,
      },
    },
  ],
};

const Governance = () => {
  return (
    <div>
      <Card padding="lg" className="flex flex-col justify-between gap-y-8">
        <div className="flex w-full items-center justify-between gap-y-6">
          <Header>Proposals</Header>
          <Button
            variant="default"
            label="New proposal"
            onClick={() => console.log('New Proposal Clicked')}
          />
        </div>
        <ProposalTabs />
      </Card>
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

export default Governance;
