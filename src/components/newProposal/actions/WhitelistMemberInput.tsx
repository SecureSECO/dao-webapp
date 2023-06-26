/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from 'react';
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
import { ACTIONS } from '@/src/lib/constants/actions';
import { AddressPattern } from '@/src/lib/constants/patterns';
import { useFormContext } from 'react-hook-form';
import { HiXMark } from 'react-icons/hi2';

export interface ProposalFormWhitelistData {
  name: 'whitelist_member';
  address: string;
}

export const emptyWhitelistData: ProposalFormWhitelistData = {
  name: 'whitelist_member',
  address: '',
};

export const WhitelistMemberInput = () => {
  const {
    register,
    formState: { errors: formErrors },
  } = useFormContext<ProposalFormActions>();

  const { prefix, index, onRemove } = useContext(ActionFormContext);

  const errors: ActionFormError<ProposalFormWhitelistData> = formErrors.actions
    ? formErrors.actions[index]
    : undefined;

  return (
    <MainCard
      header="Whitelist Member"
      variant="light"
      icon={ACTIONS.whitelist_member.icon}
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
        <Label tooltip="The address of the member to be whitelisted">
          Address
        </Label>
        <ErrorWrapper name="address" error={errors?.address ?? undefined}>
          <Input
            {...register(`${prefix}.address`, {
              required: true,
              pattern: {
                value: AddressPattern,
                message:
                  'Please enter a valid address, i.e. 0x followed by 40 characters',
              },
            })}
            id="address"
            error={errors?.address ?? undefined}
            title="Address of potential DAO member"
            placeholder="0x123..."
            className="w-full basis-2/3"
            required
          />
        </ErrorWrapper>
      </div>
    </MainCard>
  );
};
