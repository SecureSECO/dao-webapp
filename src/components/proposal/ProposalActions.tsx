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
import UnknownAction from '@/src/components/proposal/actions/UnknownAction';
import { Accordion } from '@/src/components/ui/Accordion';
import {
  DefaultMainCardHeader,
  MainCard,
  MainCardProps,
} from '@/src/components/ui/MainCard';
import { ACTIONS, ActionName, actionToName } from '@/src/lib/constants/actions';
import { Action } from '@plopmenz/diamond-governance-sdk';

/** Extends the Action type to add an optional name property,
 * which can be used to overwrite the usual mapping of the action to its ActionName */
export interface ActionView extends Action {
  name?: ActionName;
}

export interface ProposalActionsProps
  extends Omit<MainCardProps, 'icon' | 'header'> {
  actions: ActionView[] | undefined;
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
          {actions.map((action, i) => {
            const actionName = action.name ?? actionToName(action);
            if (!actionName)
              return (
                <UnknownAction key={i} value={i.toString()} action={action} />
              );
            const { view: ViewAction } = ACTIONS[actionName];
            return (
              <ViewAction key={i} value={i.toString()} action={action as any} />
            );
          })}
        </Accordion>
      )}
      {children}
    </MainCard>
  );
};

export default ProposalActions;
