/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AccordionItemProps } from '@radix-ui/react-accordion';
import { HiCog } from 'react-icons/hi2';
import { Card } from '../../ui/Card';
import ActionWrapper from './ActionWrapper';
import { Action } from '@plopmenz/diamond-governance-sdk';

export interface ProposalChangeParamAction extends Action {
  params: {
    _plugin: string;
    _param: string;
    _value: string;
  };
}
interface ChangeParamActionProps extends AccordionItemProps {
  action: ProposalChangeParamAction;
}

export const ChangeParamAction = ({
  action,
  ...props
}: ChangeParamActionProps) => {
  return (
    <ActionWrapper
      icon={HiCog}
      title="Change plugin parameter"
      description="Change the value of a parameter of a plugin"
      {...props}
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Plugin</p>
            <p className="font-medium">{action.params._plugin}</p>
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Parameter</p>
            <p className="font-medium">{action.params._param}</p>
          </Card>
        </div>
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">
            New parameter value
          </p>
          <p className="font-medium">{action.params._value}</p>
        </Card>
      </div>
    </ActionWrapper>
  );
};
