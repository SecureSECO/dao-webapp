import { ActionFormData } from '@/src/lib/Actions';
import { MintTokensAction } from './MintTokensAction';
import { WithdrawAssetsAction } from './WithdrawAssetsAction';
import { StepThreeData } from '@/src/pages/NewProposal';
import { Control, FieldErrors, UseFormGetValues } from 'react-hook-form';

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
  register: any;
  control: Control<StepThreeData>;
  getValues: UseFormGetValues<StepThreeData>;
  setValue: any;
  remover: any;
  errors: FieldErrors<StepThreeData>;
}) => (
  <div className="flex flex-col gap-6">
    {fields.map((field: Record<'id', string>, index: number) => {
      const prefix: `actions.${number}` = `actions.${index}`;
      const action: ActionFormData = getValues(prefix);
      console.log('All values', getValues());
      console.log('Action:', action);

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
