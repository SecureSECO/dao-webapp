/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useFieldArray, useForm } from 'react-hook-form';

import { ProposalActionList } from './ProposalActionList';
import { useEffect } from 'react';
import {
  emptyActionMintTokenFormData,
  emptyActionWithdrawFormData,
} from '../newProposalData';

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

    return (
      <form>
        <ProposalActionList
          fields={fields}
          register={register as any}
          control={control as any}
          getValues={getValues as any}
          setValue={setValue as any}
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