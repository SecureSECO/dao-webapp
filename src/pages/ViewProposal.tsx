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
import {
  ExecuteProposalStep,
  ExecuteProposalStepValue,
  ProposalStatus,
} from '@aragon/sdk-client';
import { ProposalStatusBadge } from '@/src/components/governance/ProposalCard';
import { HiChevronLeft, HiOutlineClock } from 'react-icons/hi2';
import { Link } from '@/src/components/ui/Link';
import { countdownText } from '@/src/lib/utils';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import ProposalVotes from '@/src/components/proposal/ProposalVotes';
import ProposalHistory from '@/src/components/proposal/ProposalHistory';
import ProposalActions from '@/src/components/proposal/ProposalActions';
import { contractInteraction } from '@/src/hooks/useToast';
import { useAccount } from 'wagmi';
import ConnectWalletWarning from '@/src/components/ui/ConnectWalletWarning';
import { Button } from '@/src/components/ui/Button';

const ViewProposal = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const { proposal, loading, error, refetch, canExecute, execute } =
    useProposal({ id });

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

  /**
   * Execute current proposal's actions
   */
  const executeProposal = async () => {
    if (!execute) return;
    contractInteraction<ExecuteProposalStep, ExecuteProposalStepValue>(
      execute,
      {
        steps: {
          confirmed: ExecuteProposalStep.DONE,
          signed: ExecuteProposalStep.EXECUTING,
        },
        messages: {
          error: 'Error executing proposal',
          success: 'Execution successful!',
        },
        onFinish: () => {
          refetch();
        },
      }
    );
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
              title={proposal?.metadata.title ?? 'Proposal not found'}
              aside={
                <div className="flex flex-row-reverse items-center justify-between gap-y-4 sm:flex-col sm:items-end">
                  <ProposalStatusBadge
                    size="md"
                    status={proposal?.status ?? ProposalStatus.PENDING}
                  />
                  <div className="flex flex-row items-center gap-x-2 text-highlight-foreground/60">
                    <HiOutlineClock className="h-5 w-5 shrink-0" />
                    {statusText(proposal?.status ?? ProposalStatus.PENDING)}
                  </div>
                </div>
              }
            >
              {proposal && (
                <div className="flex flex-col gap-y-3">
                  <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
                    {proposal.metadata.summary}
                  </p>
                  <div className="flex items-center gap-x-1 text-sm">
                    <span className="text-highlight-foreground/60">
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

            <div className="grid grid-cols-7 gap-6">
              <div className="col-span-full flex flex-col gap-y-6 lg:col-span-4">
                <ProposalVotes
                  loading={loading}
                  proposal={proposal}
                  refetch={refetch}
                />

                <ProposalActions
                  loading={loading}
                  // Will be replaced with proper actions when switching to custom SDK
                  actions={proposal?.actions.map(() => {
                    return {
                      method: '',
                      interface: '',
                      params: {},
                    };
                  })}
                >
                  {/* Execute button */}
                  {canExecute &&
                    proposal?.actions &&
                    proposal.actions.length > 0 && (
                      <div className="flex flex-row items-center gap-x-4">
                        <Button
                          disabled={!canExecute || !address}
                          type="submit"
                          label="Execute"
                          onClick={() => executeProposal()}
                        />
                        {!address && (
                          <ConnectWalletWarning action="to execute this proposal" />
                        )}
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
