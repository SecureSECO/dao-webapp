/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { FaGithub } from 'react-icons/fa';
import { Card } from '@/src/components/ui/Card';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';

export type ProposalMergeAction = IProposalAction & {
  params: {
    url: string;
  };
};

interface MergeActionProps extends AccordionItemProps {
  action: ProposalMergeAction;
}

/**
 * Shows the details of a merge action
 * @param props.action Action of type ProposalMergeAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MergeAction = ({ action, ...props }: MergeActionProps) => {
  // Parse URL
  const getParsedUrl = () => {
    const url = new URL(action.params.url);
    const owner = url.pathname.split('/')[1] ?? 'Unknown';
    const repo = url.pathname.split('/')[2] ?? 'Unknown';
    const pullNumber = url.pathname.split('/')[4] ?? 'Unknown';

    return {
      owner,
      repo,
      pullNumber,
    };
  };

  const parsedUrl = getParsedUrl();

  return (
    <ActionWrapper
      icon={FaGithub}
      title="Merge Pull Request"
      description="Merge the specified pull request into the corresponding branch"
      {...props}
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Owner</p>
            <p className="font-medium">{parsedUrl.owner}</p>
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">Repository</p>
            <p className="font-medium">{parsedUrl.repo}</p>
          </Card>
        </div>
        <Card variant="outline" size="sm">
          <p className="text-xs text-popover-foreground/80">
            Pull request #{parsedUrl.pullNumber}
          </p>
          <a
            className="flex flex-row items-center gap-x-2 text-primary-highlight transition-colors duration-200 hover:text-primary-highlight/80"
            href={action.params.url}
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
