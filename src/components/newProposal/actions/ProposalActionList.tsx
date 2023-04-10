/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MintTokensAction } from './MintTokensAction';
import { WithdrawAssetsAction } from './WithdrawAssetsAction';
import { StepThreeData, ActionFormData } from '../newProposalData';
import {
  Control,
  FieldError,
  FieldErrors,
  FieldValues,
  Merge,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

export type ActionFormError<T extends FieldValues> =
  | Merge<FieldError, FieldErrors<NonNullable<T> | T>>
  | undefined;

export const ProposalActionList = ({
  fields,
  register,
  control,
  getValues,
  setValue,
  remover,
  errors,
}: {
  fields: Record<'id', string>[];
  register: UseFormRegister<StepThreeData>;
  control: Control<StepThreeData>;
  getValues: UseFormGetValues<StepThreeData>;
  setValue: UseFormSetValue<StepThreeData>;
  remover: UseFieldArrayRemove;
  errors: FieldErrors<StepThreeData>;
}) => (
  <div className="flex flex-col gap-6">
    {fields.map((field: Record<'id', string>, index: number) => {
      const prefix: `actions.${number}` = `actions.${index}`;
      const action: ActionFormData = getValues(prefix);

      switch (action.name) {
        case 'withdraw_assets':
          return (
            <WithdrawAssetsAction
              register={register}
              prefix={prefix}
              key={field.id}
              setValue={setValue}
              errors={errors.actions ? errors.actions[index] : undefined}
              onRemove={() => remover(index)}
            />
          );
        case 'mint_tokens':
          return (
            <MintTokensAction
              register={register}
              control={control}
              prefix={prefix}
              key={field.id}
              errors={errors.actions ? errors.actions[index] : undefined}
              onRemove={() => remover(index)}
            />
          );
      }
    })}
  </div>
);