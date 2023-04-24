/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TransferType } from '@aragon/sdk-client';
import { HiArrowSmallRight } from 'react-icons/hi2';
import { Address, AddressLength } from '../components/ui/Address';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeaderCard } from '../components/ui/HeaderCard';
import Loader from '../components/ui/Loader';
import { DaoBalance, DaoBalances, useDaoBalance } from '../hooks/useDaoBalance';
import { formatRelative } from 'date-fns';
import { DaoTransfer, useDaoTransfers } from '../hooks/useDaoTransfers';
import TokenAmount, {
  transfertypeToSign,
} from '../components/ui/TokenAmount/TokenAmount';
import { useState } from 'react';
import { Link } from '@/src/components/ui/Link';

type DaoTokenProps = {
  daoBalances: DaoBalances;
  limit: number;
};

const DaoTokens = ({
  daoBalances,
  limit = daoBalances.length,
}: DaoTokenProps): JSX.Element => {
  const balances = daoBalances
    .slice() //Copies array
    .sort((a, b) => (a.updateDate < b.updateDate ? 1 : -1))
    .slice(0, limit);

  return (
    <div className="mt-4 space-y-4">
      {balances.map((balance: DaoBalance, index) => (
        <Card
          key={index}
          padding="sm"
          variant="light"
          className="p-4 dark:bg-slate-700/50"
        >
          <h2 className="font-bold">{balance.name}</h2>
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

const DaoTokensWrapped = (): JSX.Element => {
  const { daoBalances, loading, error } = useDaoBalance({});
  const [limit, setLimit] = useState(3);
  if (loading) return <Loader />;
  if (error) return <h3>{error}</h3>;

  return (
    <div>
      <DaoTokens daoBalances={daoBalances} limit={limit} />
      {limit < daoBalances.length && (
        <Button
          className="my-4"
          variant="outline"
          label="Show more tokens"
          icon={HiArrowSmallRight}
          onClick={() => setLimit(limit + Math.min(limit, 25))}
        />
      )}
    </div>
  );
};

type DaoTransfersProps = {
  daoTransfers: DaoTransfer[];
  limit?: number;
};
export const DaoTransfers = ({
  daoTransfers,
  limit = daoTransfers.length,
}: DaoTransfersProps): JSX.Element => {
  const transfers = daoTransfers.slice(0, limit);

  return (
    <div className="mt-4 space-y-4">
      {transfers.map((transfer: DaoTransfer) => (
        <Card
          key={transfer.transactionId}
          padding="sm"
          variant="light"
          className="p-4 dark:bg-slate-700/50"
        >
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

const DaoTransfersWrapped = (): JSX.Element => {
  const { daoTransfers, loading, error } = useDaoTransfers({});
  const [limit, setLimit] = useState(3);
  if (loading) return <Loader />;
  if (error) return <h3>{error}</h3>;
  if (!daoTransfers)
    return <p className="text-center font-normal">No transfers found!</p>;

  return (
    <div>
      <DaoTransfers daoTransfers={daoTransfers} limit={limit} />
      {limit < daoTransfers.length && (
        <Button
          className="my-4"
          variant="outline"
          label="Show more transfers"
          onClick={() => {
            setLimit(limit + Math.min(limit, 25));
          }}
          icon={HiArrowSmallRight}
        />
      )}
    </div>
  );
};

const Finance = () => {
  return (
    <div>
      <div className="flex flex-col gap-6">
        <HeaderCard
          title="Finance"
          aside={<Link to="/governance/new-proposal" label="New transfer" />}
        />
      </div>
      <div className="gap-4 md:grid md:grid-cols-2">
        <Card className="my-6">
          <h2 className="text-xl font-bold">Tokens</h2>
          <DaoTokensWrapped />
        </Card>
        <Card className="my-6">
          <h2 className="text-xl font-bold">Latest transfers</h2>
          <DaoTransfersWrapped />
        </Card>
      </div>
    </div>
  );
};

export default Finance;
