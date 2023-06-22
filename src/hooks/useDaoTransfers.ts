/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
import { useAlchemySDKContext } from '@/src/context/AlchemySDK';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { TokenFetch, useTokenFetch } from '@/src/hooks/useTokenFetch';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { TokenType } from '@/src/lib/constants/tokens';
import { getErrorMessage } from '@/src/lib/utils';
import { TokenInfo } from '@/src/lib/utils/token';
import {
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersParams,
  AssetTransfersResult,
  SortingOrder,
} from 'alchemy-sdk';
import { compareDesc, parseISO, sub } from 'date-fns';
import { BigNumber } from 'ethers';

export type UseDaoTransfersData = {
  daoTransfers: DaoTransfer[] | null;
  loading: boolean;
  error: string | null;
  recentCount: number | null;
};

export enum TransferType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

/**
 * The type of token that was transferred.
 * Adapted from AssetTransfersResult.
 * @see AssetTransfersResult
 */
export type DaoTransfer = {
  type: TransferType;
  tokenType: TokenType;
  creationDate?: Date;
  transferId: string;
  to: string | null;
  from: string;
  amount: BigNumber | null;
  token: TokenInfo | null;
};

export type UseDaoTransfersProps = {
  useDummyData?: boolean;
  limit?: number;
};

const defaultProps: UseDaoTransfersProps = {
  useDummyData: false,
  limit: 10,
};

/**
 * Hook to fetch the DAO transfers for the DAO that the current Diamond Governance client has been instantiated with.
 * @param props The properties to configure the hook.
 * @returns An object containing the DAO transfers, loading state and error state.
 */
export const useDaoTransfers = (
  props?: UseDaoTransfersProps
): UseDaoTransfersData => {
  const { useDummyData, limit } = Object.assign(defaultProps, props);
  const [daoTransfers, setDaoTransfers] = useState<DaoTransfer[] | null>(null);
  const [recentCount, setRecentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getTokenInfo } = useTokenFetch();

  const client = useAlchemySDKContext();
  const { daoAddress } = useDiamondSDKContext();

  const fetchDaoTransfers = async (client: Alchemy) => {
    if (!daoAddress) return;

    try {
      const params: AssetTransfersParams = {
        maxCount: limit,
        order: SortingOrder.DESCENDING,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.ERC1155,
          ...(!import.meta.env.DEV ? [AssetTransfersCategory.INTERNAL] : []),
        ],
        withMetadata: true,
      };

      const transfers = await Promise.all([
        client.core
          .getAssetTransfers({ ...params, toAddress: daoAddress })
          .then((res) =>
            res.transfers.map((t) =>
              transferToDaoTransfer(t, TransferType.DEPOSIT, getTokenInfo)
            )
          ),
        client.core
          .getAssetTransfers({ ...params, fromAddress: daoAddress })
          .then((res) =>
            res.transfers.map((t) =>
              transferToDaoTransfer(t, TransferType.WITHDRAW, getTokenInfo)
            )
          ),
      ]);

      const daoTransfers = [
        await Promise.all(transfers[0]),
        await Promise.all(transfers[1]),
      ]
        .flat()
        .sort((a, b) =>
          compareDesc(
            a.creationDate ?? Number.MAX_SAFE_INTEGER,
            b.creationDate ?? Number.MAX_SAFE_INTEGER
          )
        )
        .slice(0, limit);

      // Calculate recent transfers count as transfers that happened in the last 24 hours within the given limit
      const dayAgo = sub(new Date(), { days: 1 });
      const recentCount = daoTransfers.filter(
        (t) =>
          compareDesc(t.creationDate ?? Number.MAX_SAFE_INTEGER, dayAgo) <= 0
      ).length;
      setRecentCount(recentCount);
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

    const data: DaoTransfer[] = [
      // {
      //   type: TransferType.WITHDRAW,
      //   tokenType: TokenType.ERC20,
      //   token: {
      //     address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
      //     name: 'Dai Stablecoin',
      //     symbol: 'DAI',
      //     decimals: 18,
      //   },
      //   amount: 1000000000000000n,
      //   creationDate: new Date(2023, 2, 22),
      //   from: '0xdaoaddres',
      //   transactionId:
      //     '0xdb0f9422b5c3199021481c98a655741ca16119ff8a59571854a94a6f31dad7ba',
      //   to: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
      //   proposalId: '0x1234567890123456789012345678901234567890_0x0',
      // },
      // {
      //   type: TransferType.DEPOSIT,
      //   tokenType: TokenType.NATIVE,
      //   amount: 1000000000000000n,
      //   creationDate: new Date(2023, 2, 21),
      //   transactionId:
      //     '0xc18b310b2f8cf427d95fa905dc842df2cf999075f18579afbcbdce19f8db0a30',
      //   from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
      //   to: '0xdaoAddres',
      // },
      // {
      //   type: TransferType.DEPOSIT,
      //   tokenType: TokenType.ERC20,
      //   token: {
      //     address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
      //     name: 'Dai Stablecoin',
      //     symbol: 'DAI',
      //     decimals: 18,
      //   },
      //   amount: 1000000000000000n,
      //   creationDate: new Date(2023, 2, 20),
      //   transactionId:
      //     '0xdd8fff77c1f3e819d4224f8d02a00583c7e5d55475b8a9d70867aee0d6d16f07',
      //   from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
      //   to: '0xdaoAddress',
      // },
    ];

    setDaoTransfers([
      {
        type: TransferType.DEPOSIT,
        tokenType: TokenType.ERC20,
        creationDate: new Date(),
        transferId: '1',
        to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        amount: BigNumber.from('0x4563918244F40000'),
        token: {
          address: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
          name: 'Dai Stablecoin',
          symbol: 'DAI',
          decimals: 18,
        },
      },
      {
        type: TransferType.DEPOSIT,
        tokenType: TokenType.NATIVE,
        creationDate: new Date(),
        transferId: '2',
        to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        from: '0xc8541aae19c5069482239735ad64fac3dcc52ca2',
        amount: BigNumber.from('0x4563918244F40000'),
        token: PREFERRED_NETWORK_METADATA.nativeToken,
      },
    ]);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!client) return;
    fetchDaoTransfers(client);
  }, [client, daoAddress, limit]);

  return {
    loading,
    error,
    daoTransfers,
    recentCount,
  };
};

export const transferCategoryToTokenType = (
  category: AssetTransfersCategory
) => {
  switch (category) {
    case AssetTransfersCategory.ERC20:
      return TokenType.ERC20;
    case AssetTransfersCategory.ERC721:
    case AssetTransfersCategory.ERC1155:
      return TokenType.ERC721;
    default:
      return TokenType.NATIVE;
  }
};

/**
 * Converts an AssetTransfersResult to a DaoTransfer type.
 * @param transfer The AssetTransfersResult to convert.
 * @param type The type of the transfer (DEPOSIT or WITHDRAW). Defaults to DEPOSIT.
 * @param provider The provider to use for fetching token info.
 * @param secoinAddress The address of the SECOIN token, to skip the token info fetch when possible.
 * @returns The converted DaoTransfer.
 */
const transferToDaoTransfer = async (
  transfer: AssetTransfersResult,
  type: TransferType = TransferType.DEPOSIT,
  getTokenInfo: TokenFetch
): Promise<DaoTransfer> => {
  const isNft =
    transfer.category === AssetTransfersCategory.ERC721 ||
    transfer.category === AssetTransfersCategory.ERC1155;
  const tokenInfo = transfer.rawContract.address
    ? await getTokenInfo(
        transfer.rawContract.address,
        isNft ? TokenType.ERC721 : TokenType.ERC20
      )
    : PREFERRED_NETWORK_METADATA.nativeToken;

  const creationDate = (transfer as any).metadata.blockTimestamp;

  return {
    type,
    tokenType: transferCategoryToTokenType(transfer.category),
    creationDate: creationDate ? parseISO(creationDate) : undefined,
    transferId: transfer.uniqueId,
    to: transfer.to,
    from: transfer.from,
    amount: isNft
      ? BigNumber.from(transfer.value)
      : BigNumber.from(transfer.rawContract.value),
    token: tokenInfo,
  };
};
