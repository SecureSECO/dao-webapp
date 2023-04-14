/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useProposal } from '@/src/hooks/useProposal';
import { useParams } from 'react-router';
import { Address, AddressLength } from '@/src/components/ui/Address';
import { ProposalStatus } from '@aragon/sdk-client';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalCard';
import { HiChevronLeft, HiOutlineClock } from 'react-icons/hi2';
import { Link } from '@/src/components/ui/Link';
import { countdownText } from '@/src/lib/utils';
import { ProposalResources } from '../components/proposal/ProposalResources';
import ProposalVotes from '@/src/components/proposal/ProposalVotes';

const ViewProposal = () => {
  const { id } = useParams();
  const { proposal, loading, error, refetch } = useProposal({ id });

  const statusText = (status: ProposalStatus) => {
    if (!proposal) return '';
    switch (status) {
      case ProposalStatus.PENDING:
        return 'Starts in ' + countdownText(proposal.startDate);
      case ProposalStatus.ACTIVE:
        return 'Ends in ' + countdownText(proposal.endDate);
      default:
        return 'Ended ' + countdownText(proposal.endDate) + ' ago';
    }
  };

  return (
    <div className="space-y-2">
      {/* Back button */}
      <Link
        to="/governance"
        type="button"
        icon={HiChevronLeft}
        variant="outline"
        label="All proposals"
        className="text-lg"
      />
      <div className="grid grid-cols-7 gap-6">
        {/* Content */}
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
                <div className="flex h-full flex-row-reverse items-center justify-between gap-y-4 sm:flex-col sm:items-end">
                  <ProposalStatusBadge
                    size="md"
                    status={proposal?.status ?? ProposalStatus.PENDING}
                  />
                  <div className="flex flex-row items-center gap-x-2 text-slate-400 dark:text-slate-500">
                    <HiOutlineClock className="h-5 w-5 shrink-0" />
                    {statusText(proposal?.status ?? ProposalStatus.PENDING)}
                  </div>
                </div>
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

            <ProposalVotes
              loading={loading}
              proposal={proposal}
              refetch={refetch}
            />

            <ProposalResources
              loading={loading}
              resources={proposal?.metadata.resources}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProposal;
