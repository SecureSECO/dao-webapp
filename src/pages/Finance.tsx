/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TransferType } from '@aragon/sdk-client';
import {
  HiArrowSmallRight,
  HiArrowsRightLeft,
  HiCircleStack,
} from 'react-icons/hi2';
import { Address, AddressLength } from '../components/ui/Address';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeaderCard } from '../components/ui/HeaderCard';
import { DaoBalance, useDaoBalance } from '../hooks/useDaoBalance';
import { formatRelative } from 'date-fns';
import { DaoTransfer, useDaoTransfers } from '../hooks/useDaoTransfers';
import TokenAmount, {
  transfertypeToSign,
} from '../components/ui/TokenAmount/TokenAmount';
import { useState } from 'react';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';

type DaoTokenListProps = {
  loading: boolean;
  error: string | null;
  daoBalances: DaoBalance[];
  limit: number;
};

const DaoTokensList = ({
  loading,
  error,
  daoBalances,
  limit = daoBalances.length,
}: DaoTokenListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    );
  if (error)
    return <p className="text-center font-normal">An error was encountered</p>;

  const balances = daoBalances
    .slice() //Copies array
    .sort((a, b) => (a.updateDate < b.updateDate ? 1 : -1))
    .slice(0, limit);

  return (
    <div className="space-y-4">
      {balances.map((balance: DaoBalance, i) => (
        <Card
          key={i}
          padding="sm"
          variant="light"
          className="p-4 dark:bg-slate-700/50"
        >
          <h2 className="font-bold">
            {balance.name != '' && balance.name ? balance.name : 'Unkown Token'}
          </h2>
          <div className="flex flex-row items-center">
            <TokenAmount
              amount={balance.balance}
              tokenDecimals={balance.decimals}
              symbol={balance.symbol}
            />
            <span className="px-2">•</span>
            <span className="text-popover-foreground/80">
              <Address
                address={balance.address ?? '-'}
                maxLength={AddressLength.Small}
                hasLink={true}
                showCopy={true}
              />
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

type DaoTransfersListProps = {
  loading: boolean;
  error: string | null;
  daoTransfers: DaoTransfer[] | null;
  limit?: number;
};
export const DaoTransfersList = ({
  loading,
  error,
  daoTransfers,
  limit = daoTransfers?.length ?? 3,
}: DaoTransfersListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    );
  if (error)
    return <p className="text-center font-normal">An error was encountered</p>;

  if (!daoTransfers)
    return (
      <p className="text-center font-normal italic text-highlight-foreground/80">
        No transfers found
      </p>
    );

  const transfers = daoTransfers.slice(0, limit);

  return (
    <div className="space-y-4">
      {transfers.map((transfer: DaoTransfer) => (
        <Card key={transfer.transactionId} padding="sm" variant="light">
          <div className="flex flex-row justify-between">
            <div className="text-left">
              <h2 className="font-bold capitalize">{transfer.type}</h2>
              <span> {formatRelative(transfer.creationDate, new Date())} </span>
            </div>
            <div className="flex flex-col items-end text-right">
              <TokenAmount
                className="font-bold"
                amount={transfer.amount}
                tokenDecimals={transfer.decimals}
                symbol={transfer.tokenSymbol}
                sign={transfertypeToSign(transfer.type)}
              />
              <div className="text-popover-foreground/80">
                <Address
                  address={daoTransferAddress(transfer)}
                  maxLength={AddressLength.Small}
                  hasLink={true}
                  showCopy={true}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const daoTransferAddress = (transfer: DaoTransfer): string => {
  if (!transfer) return '-';
  if (transfer.type === TransferType.DEPOSIT) {
    return transfer.from;
  }
  if (transfer.type === TransferType.WITHDRAW) {
    return transfer.to;
  }
  throw new Error('Unreachable exception');
};

const Finance = () => {
  const {
    daoBalances,
    loading: tokensLoading,
    error: tokensError,
  } = useDaoBalance({});
  const [tokenLimit, setTokenLimit] = useState(3);

  const {
    daoTransfers,
    loading: transfersLoading,
    error: trasnfersError,
  } = useDaoTransfers({});
  const [transferLimit, setTransferLimit] = useState(3);

  return (
    <div className="space-y-6">
      <HeaderCard
        title="Finance"
        aside={<Link to="/governance/new-proposal" label="New transfer" />}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MainCard
          header={
            <DefaultMainCardHeader value={daoBalances.length} label="tokens" />
          }
          icon={HiCircleStack}
        >
          <div className="space-y-4">
            <DaoTokensList
              daoBalances={daoBalances}
              limit={tokenLimit}
              loading={tokensLoading}
              error={tokensError}
            />
            {tokenLimit < daoBalances.length && (
              <Button
                variant="outline"
                label="Show more tokens"
                icon={HiArrowSmallRight}
                onClick={() =>
                  setTokenLimit(tokenLimit + Math.min(tokenLimit, 25))
                }
              />
            )}
          </div>
        </MainCard>
        <MainCard
          header={
            <DefaultMainCardHeader
              value={daoTransfers?.length ?? 0}
              label="transfers completed"
            />
          }
          icon={HiArrowsRightLeft}
        >
          <div className="space-y-4">
            <DaoTransfersList
              daoTransfers={daoTransfers}
              limit={transferLimit}
              loading={transfersLoading}
              error={trasnfersError}
            />
            {daoTransfers && transferLimit < daoTransfers.length && (
              <Button
                variant="outline"
                label="Show more tokens"
                icon={HiArrowSmallRight}
                onClick={() =>
                  setTransferLimit(transferLimit + Math.min(transferLimit, 25))
                }
              />
            )}
          </div>
        </MainCard>
      </div>
    </div>
  );
};

export default Finance;
