/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { TokenSelectorDialogButtons } from './TokenSelectorDialogButtons';
import { TokenType } from '@aragon/sdk-client';
import { UseDaoBalanceData } from '@/src/hooks/useDaoBalance';
import { Dialog } from '@/src/components/ui/Dialog';

const meta: Meta<typeof TokenSelectorDialogButtons> = {
  component: TokenSelectorDialogButtons,
};

// Required for BigInts to be serialized correctly
// Taken from: https://stackoverflow.com/questions/65152373/typescript-serialize-bigint-in-json
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
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
    setTokenAddress: () => {},
    daoBalanceData: data,
  },
  decorators: [
    (Story) => (
      <Dialog>
        <div className="flex flex-col gap-y-2">
          <Story />
        </div>
      </Dialog>
    ),
  ],
};
