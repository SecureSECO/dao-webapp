/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Button } from '@/src/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/Tabs';
import { useProposals } from '@/src/hooks/useProposals';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Link } from '@/src/components/ui/Link';
import { useState } from 'react';
import SortSelector from '@/src/components/ui/SortSelector';

import ProposalCard from '@/src/components/governance/ProposalCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/src/lib/utils';
import { Skeleton } from '@/src/components/ui/Skeleton';
import {
  ProposalSorting,
  ProposalStatus,
  SortingOrder,
} from '@plopmenz/diamond-governance-sdk';
import { Proposal } from '@plopmenz/diamond-governance-sdk/dist/sdk/src/sugar/proposal';

const Governance = () => {
  return (
    <div className="flex flex-col gap-6">
      <HeaderCard
        title="Proposals"
        aside={
          <Link
            to="/governance/new-proposal"
            variant="default"
            label="New proposal"
          />
        }
      />
      <ProposalTabs />
    </div>
  );
};

export type ProposalStatusString =
  | 'All'
  | 'Pending'
  | 'Active'
  | 'Succeeded'
  | 'Executed'
  | 'Defeated';

const statusStringToEnum = (
  status: ProposalStatusString
): ProposalStatus | undefined => {
  if (status === 'All') return undefined;
  return ProposalStatus[status];
};

const tabs: ProposalStatusString[] = [
  'All',
  'Pending',
  'Active',
  'Succeeded',
  'Executed',
  'Defeated',
];

const ProposalTabs = () => {
  const [currentTab, setCurrentTab] = useState<ProposalStatus | undefined>(
    undefined
  );
  const [sorting, setSorting] = useState<ProposalSorting>(
    ProposalSorting.Creation
  );
  const [order, setOrder] = useState<SortingOrder | undefined>(undefined);
  const { proposals, loading, error } = useProposals({
    useDummyData: false,
    status: currentTab,
    sorting,
    order: order,
  });

  return (
    <Tabs
      defaultValue="All"
      onValueChange={(v) =>
        setCurrentTab(statusStringToEnum(v as ProposalStatusString))
      }
    >
      <div className="flex flex-row items-center gap-x-2">
        {/* Mobile category selector (dropdown) */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="subtle" size="sm" className="group">
                <div className="flex flex-row items-center gap-x-1">
                  <p className="font-normal">{currentTab ?? 'All'}</p>
                  <HiChevronDown className="h-4 w-4 transition-all duration-200 group-data-[state=open]:rotate-180" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <TabsList className="flex flex-col">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    <span className="lowercase first-letter:uppercase">
                      {tab}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop category selector */}
        <TabsList className="hidden lg:inline-block">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <span className="lowercase first-letter:uppercase">{tab}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <SortSelector setSorting={setSorting} setOrder={setOrder} />
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
  doubleColumn = true,
}: {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
  doubleColumn?: boolean;
}) => {
  if (loading)
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          doubleColumn && 'lg:grid-cols-2'
        )}
      >
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  if (error)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        An error was encountered
      </p>
    );
  return (
    <div>
      {proposals.length > 0 ? (
        <div
          className={cn(
            'grid grid-cols-1 gap-4',
            doubleColumn && 'lg:grid-cols-2'
          )}
        >
          {proposals.map((proposal) => {
            return <ProposalCard key={proposal.id} proposal={proposal} />;
          })}
        </div>
      ) : (
        <p className="font-normal italic text-highlight-foreground/80">
          No proposals found!
        </p>
      )}
    </div>
  );
};

export default Governance;
