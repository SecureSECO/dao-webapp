import { EmptyActionMintToken, emptyActionWithdraw } from '@/src/lib/Actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { ProposalActionList } from './ProposalActionList';

const meta: Meta<typeof ProposalActionList> = {
  component: ProposalActionList,
};

export default meta;
type Story = StoryObj<typeof ProposalActionList>;

const actions = [emptyActionWithdraw, EmptyActionMintToken];

export const Primary: Story = {
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
};
