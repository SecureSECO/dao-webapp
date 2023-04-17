/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @file ProposalActions.tsx - Display a proposal's actions in a MainCard, with a button to execute where applicable
 */

import CheckList from '@/src/components/icons/CheckList';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import ConnectWalletWarning from '@/src/components/ui/ConnectWalletWarning';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { contractInteraction } from '@/src/hooks/useToast';
import {
  DaoAction,
  ExecuteProposalStep,
  ExecuteProposalStepValue,
} from '@aragon/sdk-client';
import { useAccount } from 'wagmi';

/**
 * IN DEVELOPMENT
 *
 * Display a list of actions in an Accordion
 * @param props.canExecute Whether the user can execute the proposal
 * @param props.execute Function to execute the proposal
 * @param props.actions List of actions to display
 * @param props.loading Whether the proposal is loading
 * @param props.refetch Function to refetch the proposal
 * @returns An Accordion containter with items for each action
 */
const ProposalActions = ({
  canExecute,
  execute,
  actions,
  loading = false,
  refetch,
  className,
}: {
  canExecute: boolean;
  execute?: () => AsyncGenerator<ExecuteProposalStepValue, any, unknown>;
  actions: DaoAction[] | undefined;
  loading?: boolean;
  refetch: () => void;
  className?: string;
}) => {
  const { address } = useAccount();

  const executeProposal = async () => {
    if (!execute) return;
    contractInteraction<ExecuteProposalStep, ExecuteProposalStepValue>(
      () => execute(),
      {
        steps: {
          confirmed: ExecuteProposalStep.DONE,
          signed: ExecuteProposalStep.EXECUTING,
        },
        messages: {
          error: 'Error executing proposal',
          success: 'Proposal executed!',
        },
        onFinish: () => {
          refetch();
        },
      }
    );
  };

  return (
    <MainCard
      loading={loading}
      className={className + ' shrink'}
      icon={CheckList}
      header={
        <DefaultMainCardHeader value={actions?.length ?? 0} label="actions" />
      }
    >
      {!actions || actions.length === 0 ? (
        <div className="italic text-slate-500 dark:text-slate-400">
          No actions attached
        </div>
      ) : (
        <ul className="space-y-2">
          {actions.map((action, i) => (
            <li key={i}>
              <ProposalAction action={action} />
            </li>
          ))}
        </ul>
      )}

      {/* Execute button */}
      {canExecute && actions && actions.length > 0 && (
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
    </MainCard>
  );
};

/**
 * IN DEVELOPMENT
 *
 * Display an action in an accordion
 * @param props.action Action to display
 * @returns An AccordionItem with information about the action
 */
export const ProposalAction = ({ action }: { action: DaoAction }) => {
  return (
    <Card padding="sm" variant="light">
      {/* Placeholder */}
      <p className="text-xs text-slate-500 dark:text-slate-400">{action.to}</p>
    </Card>
  );
};

export default ProposalActions;
