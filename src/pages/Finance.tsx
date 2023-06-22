/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import Loading from '@/src/components/icons/Loading';
import { Address } from '@/src/components/ui/Address';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { Skeleton } from '@/src/components/ui/Skeleton';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { DaoBalance, useDaoBalance } from '@/src/hooks/useDaoBalance';
import {
  DaoTransfer,
  TransferType,
  useDaoTransfers,
} from '@/src/hooks/useDaoTransfers';
import { ACTIONS } from '@/src/lib/constants/actions';
import { format } from 'date-fns';
import {
  HiArrowSmallRight,
  HiArrowsRightLeft,
  HiCircleStack,
  HiInboxArrowDown,
} from 'react-icons/hi2';

/**
 * Convert a TransferType to a sign (+ or -)
 * @param tt TransferType, as defined in @aragon/sdk-client
 * @returns Either '+' or '-'
 * @example
 * transfertypeToSign(TransferType.DEPOSIT) // '+'
 * transfertypeToSign(TransferType.WITHDRAW) // '-'
 */
export const transfertypeToSign = (tt: TransferType) =>
  tt === TransferType.WITHDRAW ? '-' : '+';

type DaoTokenListProps = {
  loading: boolean;
  error: string | null;
  daoBalances: DaoBalance[] | null;
  limit: number;
};

const DaoTokensList = ({
  loading,
  error,
  daoBalances,
  limit = daoBalances?.length ?? 0,
}: DaoTokenListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  if (error) {
    console.error(error);
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        An error was encountered
      </p>
    );
  }
  if (daoBalances === null)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        Could not retrieve DAO balance
      </p>
    );
  if (daoBalances.length === 0)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        No tokens found
      </p>
    );

  const balances = daoBalances.slice(0, limit);

  return (
    <div className="space-y-4">
      {balances.map((balance: DaoBalance, i) => (
        <Card key={i} size="sm" variant="light">
          <p className="font-bold capitalize">
            {balance.token?.name ? balance.token.name : 'Unkown Token'}
          </p>
          <div className="flex flex-row items-center">
            <TokenAmount
              amount={balance.balance}
              tokenDecimals={balance.token?.decimals}
              symbol={balance.token?.symbol ?? undefined}
            />
            <span className="px-2">•</span>
            <span className="text-popover-foreground/80">
              <Address
                address={balance.token?.address ?? '-'}
                length="sm"
                hasLink
                showCopy
                replaceYou
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
}: DaoTransfersListProps): JSX.Element => {
  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );

  if (error) {
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        An error was encountered
      </p>
    );
  }

  if (!daoTransfers || daoTransfers.length === 0)
    return (
      <p className="font-normal italic text-highlight-foreground/80">
        No transfers found
      </p>
    );

  return (
    <div className="space-y-4">
      {daoTransfers.map((transfer: DaoTransfer) => (
        <Card key={transfer.transferId} size="sm" variant="light">
          <div className="flex flex-row justify-between">
            <div className="text-left">
              <p className="font-bold lowercase first-letter:capitalize">
                {transfer.type}
              </p>
              {transfer.creationDate && (
                <p className="text-sm">{format(transfer.creationDate, 'Pp')}</p>
              )}
            </div>
            <div className="flex flex-col items-end text-right">
              {transfer.token ? (
                <TokenAmount
                  className="font-bold"
                  amount={transfer.amount}
                  tokenDecimals={transfer.token.decimals}
                  symbol={transfer.token.symbol ?? undefined}
                  sign={transfertypeToSign(transfer.type)}
                />
              ) : (
                <p className="font-bold">?</p>
              )}
              <div className="text-popover-foreground/80">
                <Address
                  address={daoTransferAddress(transfer)}
                  length="sm"
                  hasLink
                  showCopy
                  replaceYou
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const NewTransferDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button label="New transfer" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem className="p-0">
          <Link
            className="w-full justify-start px-2 py-1"
            variant="ghost"
            to="/finance/new-deposit"
            label="New deposit"
            icon={HiInboxArrowDown}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            className="w-full justify-start px-2 py-1"
            variant="ghost"
            to="/governance/new-proposal"
            label="New withdraw"
            icon={ACTIONS.withdraw_assets.icon}
          />
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const daoTransferAddress = (transfer: DaoTransfer): string => {
  if (!transfer) return '-';
  if (transfer.type === TransferType.DEPOSIT) {
    return transfer.from;
  }
  if (transfer.type === TransferType.WITHDRAW) {
    return transfer.to ?? '-';
  }
  throw new Error('Unreachable exception');
};

const Finance = () => {
  const {
    daoBalances,
    loading: tokensLoading,
    error: tokensError,
  } = useDaoBalance();
  const [tokenLimit, setTokenLimit] = useState(5);

  const [transferLimit, setTransferLimit] = useState(5);
  const {
    daoTransfers,
    loading: transfersLoading,
    refetching: transfersRefetching,
    error: trasnfersError,
  } = useDaoTransfers({
    limit: transferLimit,
  });

  return (
    <div className="space-y-6">
      <HeaderCard title="Finance" aside={<NewTransferDropdown />} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MainCard
          header={
            <DefaultMainCardHeader
              value={daoBalances?.length ?? 0}
              label="tokens"
            />
          }
          loading={false}
          icon={HiCircleStack}
        >
          <div className="space-y-4">
            <DaoTokensList
              daoBalances={daoBalances}
              limit={tokenLimit}
              loading={tokensLoading}
              error={tokensError}
            />
            {daoBalances && tokenLimit < daoBalances.length && (
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
        <MainCard header="Transfers" icon={HiArrowsRightLeft}>
          <div className="space-y-4">
            <DaoTransfersList
              daoTransfers={daoTransfers}
              limit={transferLimit}
              loading={transfersLoading}
              error={trasnfersError}
            />
            {((daoTransfers && transferLimit <= daoTransfers.length) ||
              transfersRefetching) && (
              <Button
                variant="outline"
                disabled={transfersRefetching}
                label="Show more transfers"
                icon={transfersRefetching ? Loading : HiArrowSmallRight}
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
