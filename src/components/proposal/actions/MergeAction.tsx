/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { FaGithub } from 'react-icons/fa';

export type ProposalMergeAction = IProposalAction & {
  params: {
    owner: string;
    repo: string;
    pull_number: number;
  };
};

const fieldMap: {
  [key in keyof ProposalMergeAction['params']]: string;
} = {
  owner: 'Owner',
  repo: 'Repository',
  pull_number: 'Pull Request Number',
};

/**
 * Shows the details of a merge action
 * @param props.action Action of type ProposalMergeAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MergeAction = ({ action }: { action: ProposalMergeAction }) => {
  return (
    <ActionWrapper icon={FaGithub} title="Merge Pull Request">
      <div className="space-y-2">
        <p>Merges a pull request.</p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {Object.keys(action.params).map((item, index) => (
            <div
              key={index}
              className="broder-border flex flex-row items-center justify-between gap-x-4 rounded-full border px-3 py-1 text-right"
            >
              <p>{fieldMap[item]}</p>
              <p className="text-popover-foreground/80">
                {action.params[item]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ActionWrapper>
  );
};

export default MergeAction;
