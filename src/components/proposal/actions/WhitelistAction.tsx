/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { ACTIONS } from '@/src/lib/constants/actions';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';

export interface ProposalWhitelistAction extends Action {
  params: {
    _address: string;
  };
}

interface WhitelistActionProps extends AccordionItemProps {
  action: ProposalWhitelistAction;
}

/**
 * Shows the details of a merge action
 * @param props.action Action of type ProposalMergeAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
export const WhitelistAction = ({ action, ...props }: WhitelistActionProps) => {
  return (
    <ActionWrapper
      icon={ACTIONS.whitelist_member.icon}
      title="Whitelist member"
      description="Whitelist this address to be permanently verified"
      {...props}
    >
      <div className="space-y-2">
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">Address</p>
          <Address
            hasLink
            showCopy
            replaceYou
            address={action.params._address}
          />
        </Card>
      </div>
    </ActionWrapper>
  );
};
