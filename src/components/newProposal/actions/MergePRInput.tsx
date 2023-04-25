/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AddressPattern, NumberPattern } from '@/src/lib/patterns';
import { Input } from '../../ui/Input';
import { HiCircleStack, HiPlus, HiXMark } from 'react-icons/hi2';
import { Button } from '../../ui/Button';
import {
  Control,
  UseFormRegister,
  useFieldArray,
  useFormState,
} from 'react-hook-form';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { MainCard } from '../../ui/MainCard';
import { ActionFormError, ProposalFormActions } from '../steps/Actions';
import { Label } from '@/src/components/ui/Label';

export type ProposalFormMergeData = {
  name: 'merge_pr';
  inputs: {
    owner: string;
    repo: string;
    pull_number: number;
  };
  summary: {};
};

export const emptyMergeAction: ProposalFormMergeData = {
  name: 'merge_pr',
  inputs: {
    owner: 'SecureSECODAO',
    repo: '',
    pull_number: 0,
  },
  summary: {},
};

export const emptyMergeData: ProposalFormMergeData = {
  name: 'merge_pr',
  inputs: {
    owner: '',
    repo: '',
    pull_number: 0,
  },
  summary: {},
};

/**
 * @returns Component to be used within a form to describe the action of merging a pull request.
 */
export const MergePRInput = ({
  register,
  control,
  prefix,
  errors,
  onRemove,
}: {
  register: UseFormRegister<ProposalFormActions>;
  control: Control<ProposalFormActions>;
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
      <div className="grid grid-cols-1 justify-start gap-2 md:grid-cols-3">
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Owner of the GitHub repository">
            Repository owner
          </Label>
          <ErrorWrapper
            name="Repository owner"
            error={errors?.inputs?.owner ?? undefined}
          >
            <Input
              {...register(`${prefix}.inputs.owner`, { required: true })}
              type="text"
              id="owner"
              error={errors?.inputs?.owner ?? undefined}
              title="Username of the owner of the GitHub repository"
              placeholder="GitHub Username"
              className="w-full basis-2/3"
              required
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Name of the GitHub repository">Repository</Label>
          <ErrorWrapper
            name="Repository"
            error={errors?.inputs?.repo ?? undefined}
          >
            <Input
              {...register(`${prefix}.inputs.repo`, { required: true })}
              type="text"
              id="repo"
              error={errors?.inputs?.repo ?? undefined}
              title="Name of the GitHub repository"
              placeholder="Repository name"
              className="w-full basis-2/3"
              required
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Pull request number">Pull request number</Label>
          <ErrorWrapper
            name="Pull request number"
            error={errors?.inputs?.pull_number ?? undefined}
          >
            <Input
              {...register(`${prefix}.inputs.pull_number`, {
                required: true,
              })}
              type="number"
              id="pull_number"
              error={errors?.inputs?.pull_number ?? undefined}
              title="Pull request number"
              placeholder='Pull request number (e.g. "1")'
              className="w-full basis-2/3"
              required
            />
          </ErrorWrapper>
        </div>
      </div>
    </MainCard>
  );
};
