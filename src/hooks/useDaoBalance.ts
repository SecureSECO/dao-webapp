/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useAlchemySDKContext } from '@/src/context/AlchemySDK';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useTokenFetch } from '@/src/hooks/useTokenFetch';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { TokenType } from '@/src/lib/constants/tokens';
import { getErrorMessage } from '@/src/lib/utils';
import { TokenInfo } from '@/src/lib/utils/token';
import { Alchemy } from 'alchemy-sdk';
import { BigNumber } from 'ethers';

export type UseDaoBalanceData = {
  daoBalances: DaoBalance[] | null;
  loading: boolean;
  error: string | null;
};

export interface DaoBalance {
  type: TokenType;
  balance: BigNumber | null;
  token: TokenInfo | null;
};

export type UseDaoBalanceProps = {
  useDummyData?: boolean;
};

const defaultProps: UseDaoBalanceProps = {
  useDummyData: false,
};

/**
 * Hook to fetch the DAO balances for the DAO that the current Diamond Governance client has been instantiated with.
 * @param props The properties to configure the hook.
 * @returns An object containing the DAO balances, loading state and error state.
 */
export const useDaoBalance = (
  props?: UseDaoBalanceProps
): UseDaoBalanceData => {
  const { useDummyData } = Object.assign(defaultProps, props);
  const [daoBalances, setDaoBalances] = useState<DaoBalance[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getTokenInfo } = useTokenFetch();

  const client = useAlchemySDKContext();
  const { daoAddress } = useDiamondSDKContext();

  const fetchDaoBalance = async (client: Alchemy) => {
    if (!daoAddress) return;

    try {
      const nativeBal = await client.core.getBalance(daoAddress);
      const daoBal = await client.core.getTokenBalances(daoAddress);

      let balances: DaoBalance[] = await Promise.all(
        daoBal.tokenBalances.map(async (b) => {
          const tokenInfo = await getTokenInfo(b.contractAddress);
          return {
            type: TokenType.ERC20,
            balance: BigNumber.from(b.tokenBalance),
            token: tokenInfo,
          };
        })
      );
      setDaoBalances([
        ...balances,
        {
          type: TokenType.NATIVE,
          balance: nativeBal,
          token: PREFERRED_NETWORK_METADATA.nativeToken,
        },
      ]);

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

    const nativeBal: DaoBalance = {
      type: TokenType.NATIVE,
      balance: BigNumber.from('0x4563918244F40000'),
      token: PREFERRED_NETWORK_METADATA.nativeToken,
    };
    const erc20Bal: DaoBalance = {
      type: TokenType.ERC20,
      token: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'The Token',
        symbol: 'TOK',
        decimals: 18,
      },
      balance: BigNumber.from('0x4563918244F40000'),
    };

    setDaoBalances([nativeBal, erc20Bal]);
  };

  useEffect(() => {
    if (!client) return;
    if (useDummyData) return setDummyData();
    fetchDaoBalance(client);
  }, [client, daoAddress]);

  return {
    loading,
    error,
    daoBalances,
  };
};
