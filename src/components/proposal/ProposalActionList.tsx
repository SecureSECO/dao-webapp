import { Action } from '@/src/lib/Actions';
import { MintTokensAction } from './MintTokensAction';
import { WithdrawAssetsAction } from './WithdrawAssetsAction';

export const ProposalActionList = ({
  actions,
  register,
  control,
}: {
  actions: Action[];
  register: any;
  control: any;
}) => (
  <div>
    {actions.map((action: Action, index) => {
      switch (action.name) {
        case 'withdraw_assets':
          return (
            <WithdrawAssetsAction
              action={action}
              register={register}
              control={control}
              prefix={index.toString()}
            />
          );
        case 'mint_tokens':
          return (
            <MintTokensAction
              action={action}
              register={register}
              prefix={index.toString()}
            />
          );
      }
    })}
  </div>
);
