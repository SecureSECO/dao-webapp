import {
  Action,
  ActionMintTokenFormData,
  ActionWithdrawFormData,
} from '@/src/lib/Actions';
import { MintTokensAction } from './MintTokensAction';
import { WithdrawAssetsAction } from './WithdrawAssetsAction';
import { StepThreeData } from '@/src/pages/NewProposal';
import { FieldErrors } from 'react-hook-form';

export const ProposalActionList = ({
  actions,
  register,
  control,
  setValue,
  errors,
}: {
  actions: Action[];
  register: any;
  control: any;
  setValue: any;
  errors: FieldErrors<StepThreeData>;
}) => (
  <div>
    {actions.map((action: Action, index) => {
      switch (action.name) {
        case 'withdraw_assets':
          return (
            <WithdrawAssetsAction
              action={action}
              register={register}
              prefix={index.toString()}
              key={index}
              setValue={setValue}
              errors={errors.actions ? errors.actions[index] : undefined}
            />
          );
        case 'mint_tokens':
          return (
            <MintTokensAction
              register={register}
              control={control}
              prefix={index.toString()}
              key={index}
              errors={errors.actions ? errors.actions[index] : undefined}
            />
          );
      }
    })}
  </div>
);
