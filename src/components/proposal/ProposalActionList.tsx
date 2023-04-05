import {
  Action,
  ActionMintTokenFormData,
  ActionWithdrawFormData,
} from '@/src/lib/Actions';
import { MintTokensAction } from './MintTokensAction';
import { WithdrawAssetsAction } from './WithdrawAssetsAction';
import { StepThreeData } from '@/src/pages/NewProposal';
import { FieldErrors, UseFormGetValues } from 'react-hook-form';

export const ProposalActionList = ({
  fields,
  register,
  control,
  prefix,
  getValues,
  setValue,
  remover,
  errors,
}: {
  fields: Record<'id', string>[];
  register: any;
  control: any;
  prefix: string;
  getValues: UseFormGetValues<StepThreeData>;
  setValue: any;
  remover: any;
  errors: FieldErrors<StepThreeData>;
}) => (
  <div className="flex flex-col gap-6">
    {fields.map((field: Record<'id', string>, index: number) => {
      //TODO: Fix this red line
      const action = getValues(prefix)[index];

      switch (action.name) {
        case 'withdraw_assets':
          return (
            <WithdrawAssetsAction
              register={register}
              prefix={`${prefix}.${field.id}`}
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
              prefix={`${prefix}.${field.id}`}
              key={field.id}
              errors={errors.actions ? errors.actions[index] : undefined}
              onRemove={() => remover(index)}
            />
          );
      }
    })}
  </div>
);
