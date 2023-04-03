import {
  Action,
  EmptyActionMintToken,
  emptyActionWithdraw,
} from '@/src/lib/Actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { ProposalActionList } from './ProposalActionList';

const meta: Meta<typeof ProposalActionList> = {
  component: ProposalActionList,
};

export default meta;
type Story = StoryObj<typeof ProposalActionList>;

const StoryBuilder = (actions: Action[]): Story => ({
  render: () => {
    const { register, control } = useForm();
    return (
      <form>
        <ProposalActionList
          actions={actions}
          register={register}
          control={control}
        />
      </form>
    );
  },
});

const emptyActions = [emptyActionWithdraw, EmptyActionMintToken];
export const EmptyActions: Story = StoryBuilder(emptyActions);

const mintTokensAction: Action[] = [
  {
    name: 'mint_tokens',
    inputs: {
      mintTokensToWallets: [
        { address: '0x123456789', amount: 5 },
        { address: '0x987654321', amount: 3 },
        { address: '0x111222233', amount: 8 },
      ],
    },
    summary: {
      newTokens: 122,
      tokenSupply: 3,
      newHoldersCount: 8,
      daoTokenSymbol: 'REP',
      daoTokenAddress: '0x123456789',
    },
  },
];
export const MintTokensAction = StoryBuilder(mintTokensAction);
