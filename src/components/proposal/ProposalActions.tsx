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
import DefaultAction from '@/src/components/proposal/actions/DefaultAction';
import MintAction, {
  ProposalMintAction,
} from '@/src/components/proposal/actions/MintAction';
import WithdrawAction, {
  ProposalWithdrawAction,
} from '@/src/components/proposal/actions/WithdrawAction';
import { Accordion, AccordionItem } from '@/src/components/ui/Accordion';
import {
  DefaultMainCardHeader,
  MainCard,
  MainCardProps,
} from '@/src/components/ui/MainCard';
import MergeAction, {
  ProposalMergeAction,
} from '@/src/components/proposal/actions/MergeAction';

export interface IProposalAction {
  interface: string;
  method: string;
  params: { [name: string]: any };
}

export interface ProposalActionsProps
  extends Omit<MainCardProps, 'icon' | 'header'> {
  actions: IProposalAction[] | undefined;
  loading?: boolean;
}

/**
 * Display a list of actions in an Accordion
 * @param props.actions List of actions to display
 * @param props.loading Whether the proposal is loading
 * @returns An Accordion containter with items for each action
 */
const ProposalActions = ({
  actions,
  children,
  ...props
}: ProposalActionsProps) => {
  return (
    <MainCard
      icon={CheckList}
      header={
        <DefaultMainCardHeader value={actions?.length ?? 0} label="actions" />
      }
      {...props}
    >
      {!actions || actions.length === 0 ? (
        <div className="italic text-slate-500 dark:text-slate-400">
          No actions attached
        </div>
      ) : (
        <Accordion type="single" collapsible className={'space-y-2'}>
          {actions.map((action, i) => (
            <ProposalAction key={i} action={action} index={i} />
          ))}
        </Accordion>
      )}

      {children}
    </MainCard>
  );
};

/**
 * Display an action in an accordion
 * @param props.action Action to display
 * @returns An AccordionItem with information about the action
 */
export const ProposalAction = ({
  action,
  index,
  className,
}: {
  action: IProposalAction;
  index: number;
  className?: string;
}) => {
  console.log(action);

  const renderAction = () => {
    switch (action.method) {
      case 'withdraw':
        return <WithdrawAction action={action as ProposalWithdrawAction} />;
      case 'mint':
        return <MintAction action={action as ProposalMintAction} />;
      case 'merge':
        return <MergeAction action={action as ProposalMergeAction} />;
      default:
        return <DefaultAction action={action} />;
    }
  };

  return (
    <AccordionItem value={index.toString()} className={className}>
      {renderAction()}
    </AccordionItem>
  );
};

export default ProposalActions;
