/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useAragonSDKContext } from '@/src/context/AragonSDK';

import {
  Client,
  ITransferQueryParams,
  SortDirection,
  TokenType,
  Transfer,
  TransferSortBy,
  TransferType,
} from '@aragon/sdk-client';
import { useEffect, useState } from 'react';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { getErrorMessage } from '@/src/lib/utils';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';

export type UseDaoTransfersData = {
  daoTransfers: DaoTransfer[] | null;
  loading: boolean;
  error: string | null;
};

export type DaoTransfer = {
  type: TransferType;
  tokenType: TokenType;
  creationDate: Date;
  transactionId: string;
  to: string;
  from: string;
  amount: BigInt | null;
  decimals: number | null;
  tokenAddress: string | null;
  tokenName: string | null;
  tokenSymbol: string | null;
  proposalId: String | null;
};

export type UseDaoTransfersProps = {
  useDummyData?: boolean;
  limit?: number;
};

const defaultProps: UseDaoTransfersProps = {
  useDummyData: false,
  limit: 10,
};

export const useDaoTransfers = (
  props?: UseDaoTransfersProps
): UseDaoTransfersData => {
  const { useDummyData, limit } = Object.assign(defaultProps, props);
  const [daoTransfers, setDaoTransfers] = useState<DaoTransfer[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { client } = useAragonSDKContext();
  const { client: diamondClient } = useDiamondSDKContext();

  const fetchDaoTransfers = async (client: Client) => {
    if (!diamondClient) {
      setLoading(false);
      setError('No DiamondGovernanceSDK client found');
      return;
    }

    try {
      // Fetch DAO address from Diamond governance facet
      const daoRef = await diamondClient?.pure.IDAOReferenceFacet();
      const daoAddress = await daoRef.dao();

      const params: ITransferQueryParams = {
        daoAddressOrEns: daoAddress,
        sortBy: TransferSortBy.CREATED_AT, // optional
        limit, // optional
        skip: 0, // optional
        direction: SortDirection.DESC, // optional, options: DESC or ASC
      };

      const transfers: Transfer[] | null = await client.methods.getDaoTransfers(
        params
      );

      const daoTransfers = transfers?.map(transferToDaoTransfer) ?? null;
      setDaoTransfers(daoTransfers);
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

    const data: Transfer[] = [
      {
        type: TransferType.WITHDRAW,
        tokenType: TokenType.ERC20,
        token: {
          address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18,
        },
        amount: 1000000000000000n,
        creationDate: new Date(2023, 2, 22),
        from: '0xdaoaddres',
        transactionId:
          '0xdb0f9422b5c3199021481c98a655741ca16119ff8a59571854a94a6f31dad7ba',
        to: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        proposalId: '0x1234567890123456789012345678901234567890_0x0',
      },
      {
        type: TransferType.DEPOSIT,
        tokenType: TokenType.NATIVE,
        amount: 1000000000000000n,
        creationDate: new Date(2023, 2, 21),
        transactionId:
          '0xc18b310b2f8cf427d95fa905dc842df2cf999075f18579afbcbdce19f8db0a30',
        from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        to: '0xdaoAddres',
      },
      {
        type: TransferType.DEPOSIT,
        tokenType: TokenType.ERC20,
        token: {
          address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18,
        },
        amount: 1000000000000000n,
        creationDate: new Date(2023, 2, 20),
        transactionId:
          '0xdd8fff77c1f3e819d4224f8d02a00583c7e5d55475b8a9d70867aee0d6d16f07',
        from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        to: '0xdaoAddress',
      },
    ];

    setDaoTransfers(data.map(transferToDaoTransfer));
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!client) return;
    fetchDaoTransfers(client);
  }, [client]);

  return {
    loading,
    error,
    daoTransfers,
  };
};

const transferToDaoTransfer = (transfer: Transfer): DaoTransfer => {
  const x = transfer as any;
  let result = {
    type: transfer.type,
    tokenType: transfer.tokenType,
    creationDate: transfer.creationDate,
    transactionId: transfer.transactionId,
    to: transfer.to,
    from: transfer.from,
    amount: x.amount ?? null,
    decimals: x.token?.decimals ?? null,
    tokenAddress: x.token?.address ?? null,
    tokenName: x.token?.name ?? null,
    tokenSymbol: x.token?.symbol ?? null,
    proposalId: x.proposalId ?? null,
  };
  switch (transfer.tokenType) {
    case TokenType.NATIVE:
      // eslint-disable-next-line no-case-declarations
      const meta = PREFERRED_NETWORK_METADATA;
      result.decimals = meta.nativeCurrency.decimals;
      result.tokenName = meta.nativeCurrency.name;
      result.tokenSymbol = meta.nativeCurrency.symbol;
      break;
    case TokenType.ERC721:
      result.amount = x.amount ?? 1;
      result.decimals = x.token?.decimals ?? 0;
      break;
    case TokenType.ERC20:
      break;
    default:
      console.error(
        'useDaoTransfers.ts ~ transferToDaoTransfer: Unexpected tokentype'
      );
      break;
  }

  return result;
};
