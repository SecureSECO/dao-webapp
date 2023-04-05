import {
  Action,
  EmptyActionMintToken,
  emptyActionMintTokenFormData,
  emptyActionWithdraw,
  emptyActionWithdrawFormData,
} from '@/src/lib/Actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ProposalActionList } from './ProposalActionList';
import { useEffect } from 'react';

const meta: Meta<typeof ProposalActionList> = {
  component: ProposalActionList,
};

export default meta;
type Story = StoryObj<typeof ProposalActionList>;

const StoryBuilder = (actions: any[]): Story => ({
  render: () => {
    const { register, setValue, getValues, control } = useForm();
    const { fields, append, remove } = useFieldArray({
      name: 'test',
      control: control,
    });
    useEffect(() => {
      actions.forEach((action) => {
        append(action);
      });
    }, []);

    return (
      <form>
        <ProposalActionList
          fields={fields}
          register={register}
          prefix="test"
          errors={{ actions: [] }}
          getValues={getValues as any}
          setValue={setValue}
          control={control}
          remover={remove}
        />
      </form>
    );
  },
});

const emptyActions = [
  emptyActionMintTokenFormData,
  emptyActionWithdrawFormData,
];
export const EmptyActions: Story = StoryBuilder(emptyActions);

const mintTokensAction = [
  { name: 'mint_tokens', wallets: [{ address: '0x123', amount: 1 }] },
];
export const MintTokensAction = StoryBuilder(mintTokensAction);

const withdrawAssets = [
  {
    name: 'withdraw_assets',
    recipient: '0x123456',
    tokenAddress: '0x987654321',
    amount: '1',
  },
];
export const WithdrawAssetsAction = StoryBuilder(withdrawAssets);
