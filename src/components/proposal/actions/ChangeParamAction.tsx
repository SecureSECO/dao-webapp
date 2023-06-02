/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { HiCog } from 'react-icons/hi2';

import ActionWrapper from './ActionWrapper';

export interface ProposalChangeParamAction extends Action {
  // param name and value type depend on the plugin and parameter being changed
  params: {
    [key: string]: any;
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
            <p className="font-medium">{action.interface}</p>
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Parameter</p>
            {/* First splits the method name on '(' to remove the parameters
                Then slices the remaining string to remove the 'set' in front of the variable name */}
            <p className="font-medium">
              {action.method.split('(')[0].slice(3)}
            </p>
          </Card>
        </div>
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">New value</p>
          <p className="font-medium">
            {Object.values(action.params)[0].toString()}
          </p>
        </Card>
      </div>
    </ActionWrapper>
  );
};
