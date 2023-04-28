/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Input } from '../../ui/Input';
import { HiCircleStack, HiXMark } from 'react-icons/hi2';
import { Button } from '../../ui/Button';
import { Control, UseFormRegister } from 'react-hook-form';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { MainCard } from '../../ui/MainCard';
import { ActionFormError, ProposalFormActions } from '../steps/Actions';
import { Label } from '@/src/components/ui/Label';

export type ProposalFormMergeData = {
  name: 'merge_pr';
  inputs: {
    url: string;
  };
  summary: {};
};

export const emptyMergeAction: ProposalFormMergeData = {
  name: 'merge_pr',
  inputs: {
    url: '',
  },
  summary: {},
};

export const emptyMergeData: ProposalFormMergeData = {
  name: 'merge_pr',
  inputs: {
    url: '',
  },
  summary: {},
};

/**
 * @returns Component to be used within a form to describe the action of merging a pull request.
 */
export const MergePRInput = ({
  register,
  prefix,
  errors,
  onRemove,
}: {
  register: UseFormRegister<ProposalFormActions>;
  prefix: `actions.${number}`;
  errors: ActionFormError<ProposalFormMergeData>;
  onRemove: () => void;
}) => {
  return (
    <MainCard
      header="Merge Pull Request"
      variant="light"
      icon={HiCircleStack}
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      <div className="flex flex-col gap-y-1">
        <Label tooltip="Link to the pull request on GitHub">
          Pull request URL
        </Label>
        <ErrorWrapper
          name="Pull request URL"
          error={errors?.inputs?.url ?? undefined}
        >
          <Input
            {...register(`${prefix}.inputs.url`, {
              required: true,
              pattern: {
                value: /^(https:\/\/github.com\/.+\/.+\/pull\/\d+)$/,
                message: 'Please enter a valid GitHub pull request URL',
              },
            })}
            type="url"
            id="url"
            error={errors?.inputs?.url ?? undefined}
            title="Link to the pull request on GitHub"
            placeholder="https://github.com/..."
            className="w-full basis-2/3"
            required
          />
        </ErrorWrapper>
      </div>
    </MainCard>
  );
};
