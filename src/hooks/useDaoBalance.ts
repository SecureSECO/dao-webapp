/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useAragonSDKContext } from '@/src/context/AragonSDK';

import { AssetBalance, Client, TokenType } from '@aragon/sdk-client';
import { useEffect, useState } from 'react';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { getErrorMessage } from '@/src/lib/utils';

export type UseDaoBalanceData = {
  daoBalances: DaoBalance[];
  loading: boolean;
  error: string | null;
};

export type DaoBalance = {
  type: TokenType;
  updateDate: Date;
  balance: bigint | null;
  decimals: number | null;
  address: string | null;
  name: string | null;
  symbol: string | null;
};

export type UseDaoBalanceProps = {
  useDummyData?: boolean;
};

export const useDaoBalance = ({
  useDummyData = false,
}: UseDaoBalanceProps): UseDaoBalanceData => {
  const [daoBalances, setDaoBalances] = useState<DaoBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { client } = useAragonSDKContext();

  const fetchDaoBalance = async (client: Client) => {
    if (!import.meta.env.VITE_DAO_ADDRESS) {
      setLoading(false);
      setError("DAO address env variable isn't set");
      return;
    }
    const daoAddressOrEns: string = import.meta.env.VITE_DAO_ADDRESS;
    try {
      const daoBal: AssetBalance[] | null = await client.methods.getDaoBalances(
        { daoAddressOrEns }
      );
      let balances: DaoBalance[] = [];
      if (daoBal != null) {
        balances = daoBal.map(assetBalanceToDaoBalance);
      }
      setDaoBalances(balances);

      setLoading(false);
      setError(null);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  const setDummyData = () => {
    setLoading(false);
    setError(null);

    const nativeBal: AssetBalance = {
      type: TokenType.NATIVE,
      balance: 100000n,
      updateDate: new Date(2023, 2, 10),
    };
    const erc20Bal: AssetBalance = {
      type: TokenType.ERC20,
      address: '0x1234567890123456789012345678901234567890',
      name: 'The Token',
      symbol: 'TOK',
      decimals: 18,
      balance: 200000n,
      updateDate: new Date(2023, 2, 10),
    };
    const erc721Bal: AssetBalance = {
      type: TokenType.ERC721,
      address: '0x2222567890123456789012345678901234567890',
      name: 'The ERC 721 token',
      symbol: 'TOK2',
      updateDate: new Date(2023, 2, 10),
    };

    setDaoBalances([
      assetBalanceToDaoBalance(nativeBal),
      assetBalanceToDaoBalance(erc20Bal),
      assetBalanceToDaoBalance(erc721Bal),
    ]);
  };

  useEffect(() => {
    if (!client) return;
    if (useDummyData) return setDummyData();
    fetchDaoBalance(client);
  }, [client]);

  return {
    loading,
    error,
    daoBalances,
  };
};

function assetBalanceToDaoBalance(assetBalance: AssetBalance): DaoBalance {
  const x = assetBalance as any;
  let result = {
    type: assetBalance.type,
    updateDate: assetBalance.updateDate,
    balance: x.balance ?? null,
    decimals: x.decimals ?? null,
    address: x.address ?? null,
    name: x.name ?? null,
    symbol: x.symbol ?? null,
  };
  switch (assetBalance.type) {
    case TokenType.NATIVE:
      // eslint-disable-next-line no-case-declarations
      const metadata = PREFERRED_NETWORK_METADATA;
      result.decimals = metadata.nativeCurrency.decimals;
      result.address = import.meta.env.VITE_DAO_ADDRESS;
      result.name = metadata.nativeCurrency.name;
      result.symbol = metadata.nativeCurrency.symbol;
      break;
    case TokenType.ERC721:
      result.balance = x.balance ?? 1;
      result.decimals = x.decimals ?? 0;
      break;
    case TokenType.ERC20:
      break;
    default:
      console.error(
        'useDaoBalance.ts ~ assetBalanceToDaoBalance: Unexpected tokentype'
      );
      break;
  }

  return result;
}
