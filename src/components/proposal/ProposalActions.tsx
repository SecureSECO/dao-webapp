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
import { Accordion } from '@/src/components/ui/Accordion';
import {
  DefaultMainCardHeader,
  MainCard,
  MainCardProps,
} from '@/src/components/ui/MainCard';
import ProposalActionFilter from '@/src/components/proposal/actions/ProposalActionFilter';

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
  loading,
  ...props
}: ProposalActionsProps) => {
  return (
    <MainCard
      loading={loading}
      icon={CheckList}
      header={
        <DefaultMainCardHeader value={actions?.length ?? 0} label="actions" />
      }
      {...props}
    >
      {!actions || actions.length === 0 ? (
        <div className="italic text-popover-foreground/80">
          No actions attached
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {actions.map((action, i) => (
            <ProposalActionFilter
              key={i}
              value={i.toString()}
              action={action}
            />
          ))}
        </Accordion>
      )}
      {children}
    </MainCard>
  );
};

export default ProposalActions;
