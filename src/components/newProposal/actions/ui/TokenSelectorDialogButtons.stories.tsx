import type { Meta, StoryObj } from '@storybook/react';

import { TokenSelectorDialogButtons } from './TokenSelectorDialogButtons';
import { TokenType } from '@aragon/sdk-client';
import { UseDaoBalanceData } from '@/src/hooks/useDaoBalance';
import { Dialog } from '@/src/components/ui/Dialog';

const meta: Meta<typeof TokenSelectorDialogButtons> = {
  component: TokenSelectorDialogButtons,
};

export default meta;
type Story = StoryObj<typeof TokenSelectorDialogButtons>;

const data: UseDaoBalanceData = {
  daoBalances: [
    {
      type: TokenType.ERC20,
      updateDate: new Date(),
      balance: 10000n,
      decimals: 2,
      address: '0x1234567890098765432112345678900987654321',
      name: 'Test Token',
      symbol: 'TST',
    },
    {
      type: TokenType.ERC721,
      updateDate: new Date(),
      balance: 12345n,
      decimals: 2,
      address: '0x19999999098765432112345678900987654321',
      name: 'Test Token2',
      symbol: 'TS2',
    },
    {
      type: TokenType.ERC20,
      updateDate: new Date(),
      balance: null,
      decimals: null,
      address: null,
      name: null,
      symbol: 'TS2',
    },

    {
      type: TokenType.NATIVE,
      updateDate: new Date(),
      balance: 42345n,
      decimals: 2,
      address: '0x19999999098765432112345333333337654321',
      name: 'Test Token3',
      symbol: 'TS3',
    },
  ],
  loading: false,
  error: null,
};

export const Primary: Story = {
  args: {
    setTokenAddress: () => console.log('Address set'),
  },
  render: () => (
    <Dialog>
      <div className="flex flex-col gap-4">
        <TokenSelectorDialogButtons
          setTokenAddress={() => console.log('Address set')}
          daoBalanceData={data}
        />
      </div>
    </Dialog>
  ),
};
