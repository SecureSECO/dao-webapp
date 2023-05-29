/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { FaGithub } from 'react-icons/fa';
import { Card } from '@/src/components/ui/Card';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { Action } from '@plopmenz/diamond-governance-sdk';

export interface ProposalMergeAction extends Action {
  params: {
    _owner: string;
    _repo: string;
    _pull_number: string;
  };
}

interface MergeActionProps extends AccordionItemProps {
  action: ProposalMergeAction;
}

/**
 * Shows the details of a merge action
 * @param props.action Action of type ProposalMergeAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MergeAction = ({ action, ...props }: MergeActionProps) => {
  return (
    <ActionWrapper
      icon={FaGithub}
      title="Merge pull request"
      description="Merge the specified pull request into the corresponding branch"
      {...props}
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Owner</p>
            <p className="font-medium">{action.params._owner}</p>
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Repository</p>
            <p className="font-medium">{action.params._repo}</p>
          </Card>
        </div>
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">
            Pull request #{action.params._pull_number}
          </p>
          <a
            className="flex flex-row items-center gap-x-2 text-primary-highlight transition-colors duration-200 hover:text-primary-highlight/80"
            href={`https://github.com/${action.params._owner}/${action.params._repo}/pull/${action.params._pull_number}`}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
            <HiArrowTopRightOnSquare className="h-4 w-4 shrink-0" />
          </a>
        </Card>
      </div>
    </ActionWrapper>
  );
};

export default MergeAction;
