/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IProposalAction } from '@/src/components/proposal/ProposalActions';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { AiFillGithub } from 'react-icons/ai';
import { HiCircleStack } from 'react-icons/hi2';

export type ProposalMergeAction = IProposalAction & {
  params: {
    _owner: string;
    _repo: string;
    _pull_number: number;
  };
};

const fieldMap: {
  [key in keyof ProposalMergeAction['params']]: string;
} = {
  _owner: 'Owner',
  _repo: 'Repository',
  _pull_number: 'Pull Request Number',
};

/**
 * Shows the details of a merge action
 * @param props.action Action of type ProposalMergeAction to be shown
 * @returns Details of a mint action wrapped in a GeneralAction component
 */
const MergeAction = ({ action }: { action: ProposalMergeAction }) => {
  return (
    <ActionWrapper icon={AiFillGithub} title="Merge Pull Request">
      <div className="space-y-2">
        <p>Merges a pull request.</p>
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {Object.keys(action.params).map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between gap-x-4 rounded-full border border-slate-200 px-3 py-1 text-right dark:border-slate-700"
            >
              <p>{fieldMap[item]}</p>
              <p className="text-slate-500 ">{action.params[item]}</p>
            </div>
          ))}
        </div>
      </div>
    </ActionWrapper>
  );
};

export default MergeAction;
