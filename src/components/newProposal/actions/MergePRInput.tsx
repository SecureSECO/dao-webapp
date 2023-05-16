/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from 'react';
import { Label } from '@/src/components/ui/Label';
import { GithubPullRequestPattern } from '@/src/lib/constants/patterns';
import { useFormContext } from 'react-hook-form';
import { HiCircleStack, HiXMark } from 'react-icons/hi2';

import { Button } from '../../ui/Button';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { Input } from '../../ui/Input';
import { MainCard } from '../../ui/MainCard';
import {
  ActionFormContext,
  ActionFormError,
  ProposalFormActions,
} from '../steps/Actions';

export type ProposalFormMergeData = {
  name: 'merge_pr';
  inputs: {
    url: string;
  };
};

export const emptyMergeAction: ProposalFormMergeData = {
  name: 'merge_pr',
  inputs: {
    url: '',
  },
};

export const emptyMergeData: ProposalFormMergeData = {
  name: 'merge_pr',
  inputs: {
    url: '',
  },
};

/**
 * @returns Component to be used within a form to describe the action of merging a pull request.
 */
export const MergePRInput = () => {
  const {
    register,
    formState: { errors: formErrors },
    control,
  } = useFormContext<ProposalFormActions>();

  const { prefix, index, onRemove } = useContext(ActionFormContext);

  const errors: ActionFormError<ProposalFormMergeData> = formErrors.actions
    ? formErrors.actions[index]
    : undefined;

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
                value: GithubPullRequestPattern,
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
