import {
  emptyActionMintTokenFormData,
  emptyActionWithdrawFormData,
} from '@/src/lib/Actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Control, useFieldArray, useForm } from 'react-hook-form';

import { ProposalActionList } from './ProposalActionList';
import { useEffect } from 'react';
import { StepThreeData } from '@/src/pages/NewProposal';

const meta: Meta<typeof ProposalActionList> = {
  component: ProposalActionList,
};

export default meta;
type Story = StoryObj<typeof ProposalActionList>;

const StoryBuilder = (actions: any[]): Story => ({
  render: () => {
    const { register, setValue, getValues, control } = useForm();
    const { fields, append, remove } = useFieldArray({
      name: 'actions',
      control: control,
    });
    useEffect(() => {
      actions.forEach((action) => {
        append(action);
      });
    }, []);

    const controlX = control as any as Control<StepThreeData>;

    return (
      <form>
        <ProposalActionList
          fields={fields}
          register={register}
          control={controlX}
          getValues={getValues as any}
          setValue={setValue}
          remover={remove}
          errors={{ actions: [] }}
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
