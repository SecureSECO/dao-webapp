import { Action } from '@/src/lib/Actions';
import { MintTokensAction } from './MintTokensAction';
import { WithdrawAssetsAction } from './WithdrawAssetsAction';

export const ProposalActionList = ({
  actions,
  register,
  setValue,
}: {
  actions: Action[];
  register: any;
  setValue: any;
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
            />
          );
        case 'mint_tokens':
          return (
            <MintTokensAction
              action={action}
              register={register}
              prefix={index.toString()}
              key={index}
            />
          );
      }
    })}
  </div>
);
