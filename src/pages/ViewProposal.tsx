/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import {
  ProposalStatusBadge,
  ProposalStatusString,
} from '@/src/components/governance/ProposalCard';
import ProposalActions from '@/src/components/proposal/ProposalActions';
import ProposalHistory from '@/src/components/proposal/ProposalHistory';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import ProposalVotes from '@/src/components/proposal/ProposalVotes';
import { Address } from '@/src/components/ui/Address';
import {
  ConditionalButton,
  ConnectWalletWarning,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Link } from '@/src/components/ui/Link';
import { useProposal } from '@/src/hooks/useProposal';
import { toast } from '@/src/hooks/useToast';
import { useTotalVotingWeight } from '@/src/hooks/useTotalVotingWeight';
import { countdownText } from '@/src/lib/utils/date';
import { ProposalStatus } from '@plopmenz/diamond-governance-sdk';
import DOMPurify from 'dompurify';
import { HiChevronLeft, HiOutlineClock } from 'react-icons/hi2';
import { useParams } from 'react-router';
import { useAccount } from 'wagmi';

const ViewProposal = () => {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const { proposal, votes, loading, error, refetch, canExecute, canVote } =
    useProposal({ id, address });
  const { totalVotingWeight } = useTotalVotingWeight({
    blockNumber: proposal?.data.parameters.snapshotBlock,
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const statusText = (status: ProposalStatus) => {
    if (!proposal) return '';
    switch (status) {
      case ProposalStatus.Pending:
        return 'Starts in ' + countdownText(proposal.startDate);
      case ProposalStatus.Active:
        return 'Ends in ' + countdownText(proposal.endDate);
      default:
        return 'Ended ' + countdownText(proposal.endDate) + ' ago';
    }
  };

  /**
   * Execute current proposal's actions
   */
  const executeProposal = async () => {
    if (!proposal)
      return toast.error({
        title: 'No proposal found',
        description: 'Please try again later',
      });

    setIsExecuting(true);
    toast.contractTransaction(() => proposal.Execute(), {
      error: 'Error executing proposal',
      success: 'Execution successful!',
      onSuccess: () => refetch(),
      onFinish: () => setIsExecuting(false),
    });
  };

  return (
    <div className="space-y-2">
      {/* Back button */}
      <Link
        to="/governance"
        icon={HiChevronLeft}
        variant="outline"
        label="All proposals"
        className="text-lg"
      />
      <div className="space-y-6">
        {(!loading && !proposal) || error ? (
          <HeaderCard loading={loading} title={error ?? 'Proposal not found'} />
        ) : (
          <>
            <HeaderCard
              loading={loading}
              className="max-h-96 overflow-y-auto"
              title={proposal?.metadata.title ?? 'Proposal not found'}
              aside={
                <div className="flex flex-row-reverse items-center justify-between gap-y-4 sm:flex-col sm:items-end">
                  <ProposalStatusBadge
                    size="md"
                    status={
                      ProposalStatus[
                        proposal?.status ?? ProposalStatus.Pending
                      ] as ProposalStatusString
                    }
                  />
                  <div className="flex flex-row items-center gap-x-2 text-highlight-foreground/60 leading-4">
                    <HiOutlineClock className="h-5 w-5 shrink-0" />
                    {statusText(proposal?.status ?? ProposalStatus.Pending)}
                  </div>
                </div>
              }
            >
              {proposal && (
                <div className="flex flex-col gap-y-3">
                  <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
                    {proposal.metadata.description}
                  </p>
                  {/* Note that since our HTML is sanitized, this dangerous action is safe */}
                  {proposal.metadata.body &&
                    proposal.metadata.body !== '<p></p>' && (
                      <div
                        className="styled-editor-content w-full break-words"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(proposal.metadata.body),
                        }}
                      />
                    )}
                  <div>
                    <div className="flex items-center gap-x-1 text-sm">
                      <span className="text-highlight-foreground/60">
                        Published by
                      </span>
                      <Address
                        address={proposal.data.creator}
                        hasLink
                        replaceYou
                      />
                    </div>
                    {proposal.status === ProposalStatus.Executed && (
                      <div className="flex items-center gap-x-1 text-sm">
                        <span className="text-highlight-foreground/60">
                          Executed by
                        </span>
                        <Address
                          address={proposal.data.executor}
                          hasLink
                          replaceYou
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </HeaderCard>

            <div className="grid grid-cols-7 gap-6">
              <div className="col-span-full flex flex-col gap-y-6 lg:col-span-4">
                <ProposalVotes
                  loading={loading}
                  proposal={proposal}
                  votes={votes}
                  refetch={refetch}
                  canVote={canVote}
                  totalVotingWeight={totalVotingWeight}
                />

                <ProposalActions
                  loading={loading}
                  // Will be replaced with proper actions when switching to custom SDK
                  actions={proposal?.actions}
                >
                  {/* Execute button */}
                  {canExecute &&
                    proposal?.actions &&
                    proposal.actions.length > 0 && (
                      <div className="flex flex-row items-center gap-x-4">
                        <ConditionalButton
                          disabled={isExecuting}
                          type="submit"
                          label="Execute"
                          onClick={() => executeProposal()}
                          conditions={[
                            {
                              when: !isConnected,
                              content: (
                                <ConnectWalletWarning action="to execute this proposal" />
                              ),
                            },
                            {
                              when: !canExecute,
                              content: (
                                <Warning>
                                  You cannot execute this proposal
                                </Warning>
                              ),
                            },
                          ]}
                        />
                      </div>
                    )}
                </ProposalActions>
              </div>

              <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
                <ProposalResources
                  loading={loading}
                  resources={proposal?.metadata.resources}
                />

                <ProposalHistory proposal={proposal} loading={loading} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProposal;
