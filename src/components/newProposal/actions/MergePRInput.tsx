/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext, useEffect } from 'react';
import {
  ActionFormContext,
  ActionFormError,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import { Button } from '@/src/components/ui/Button';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import { CONFIG } from '@/src/lib/constants/config';
import { GithubPullRequestPattern } from '@/src/lib/constants/patterns';
import { useFormContext, useWatch } from 'react-hook-form';
import { HiCircleStack, HiXMark } from 'react-icons/hi2';

export interface ProposalFormMergeData {
  name: 'merge_pr';
  url: string;
  sha: string;
}

export const emptyMergeData: ProposalFormMergeData = {
  name: 'merge_pr',
  url: '',
  sha: '',
};

/**
 * @returns Component to be used within a form to describe the action of merging a pull request.
 */
export const MergePRInput = () => {
  const {
    register,
    formState: { errors: formErrors },
    setValue,
  } = useFormContext<ProposalFormActions>();

  const { prefix, index, onRemove } = useContext(ActionFormContext);

  const errors: ActionFormError<ProposalFormMergeData> = formErrors.actions
    ? formErrors.actions[index]
    : undefined;

  const url = useWatch({ name: `${prefix}.url` });

  useEffect(() => {
    const debounced = setTimeout(async () => {
      if (!url) return;

      // Fetch sha from pr-merger server
      const res = await fetch(
        `${CONFIG.PR_MERGER_API_URL}/latestCommit?url=${url}`
      );

      const json = await res.json();

      if (json.status !== 'ok' || json.data?.sha == null) {
        throw new Error('Could not fetch latest commit hash');
      }

      setValue(`${prefix}.sha`, json.data.sha);
    }, 1000);

    return () => clearTimeout(debounced);
  }, [url]);

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
        <ErrorWrapper name="Pull request URL" error={errors?.url ?? undefined}>
          <Input
            {...register(`${prefix}.url`, {
              required: true,
              pattern: {
                value: GithubPullRequestPattern,
                message: 'Please enter a valid GitHub pull request URL',
              },
            })}
            type="url"
            id="url"
            error={errors?.url ?? undefined}
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
