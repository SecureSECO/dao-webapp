import { useAragonSDKContext } from '@/src/context/AragonSDK';

import { AssetBalance, Client, TokenType } from '@aragon/sdk-client';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../lib/utils';

export type UseDaoBalanceData = {
  daoBalances: DaoBalances;
  loading: boolean;
  error: string | null;
};

export type DaoBalances = AssetBalance[] | null;

export type UseDaoBalanceProps = {
  useDummyData?: boolean;
};

export const useDaoBalance = ({
  useDummyData = false,
}: UseDaoBalanceProps): UseDaoBalanceData => {
  const [daoBalances, setDaoBalances] = useState<DaoBalances>(null);
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
      if (daoBal) {
        //todo
        setDaoBalances(daoBal);

        if (loading) setLoading(false);
        if (error) setError(null);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  const setDummyData = () => {
    if (loading) setLoading(false);
    if (error) setError(null);

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

    //TODO
    setDaoBalances([nativeBal, erc20Bal, erc721Bal]);
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
