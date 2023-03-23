import { TransferType } from '@aragon/sdk-client';
import { HiArrowSmallRight, HiPlus } from 'react-icons/hi2';
import { Address } from '../components/ui/Address';
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

type DaoTokenProps = {
  daoBalances: DaoBalances;
  max_amount: number;
};

const DaoTokens = ({
  daoBalances,
  max_amount = daoBalances.length,
}: DaoTokenProps): JSX.Element => {
  const balances = daoBalances
    .slice() //Copies array
    .sort((a, b) => (a.updateDate < b.updateDate ? 1 : -1))
    .slice(0, max_amount);

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
            <span>
              <Address
                address={balance.address ?? '-'}
                maxLength={10}
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
  const [maxAmount, setMaxAmount] = useState(3);
  if (loading) return <Loader></Loader>;
  if (error) return <h3>{error}</h3>;
  return (
    <div>
      {DaoTokens({ daoBalances: daoBalances, max_amount: maxAmount })}
      {maxAmount < daoBalances.length && (
        <Button
          className="my-4"
          variant="outline"
          label="Show more tokens"
          icon={HiArrowSmallRight}
          onClick={() => setMaxAmount(maxAmount + Math.min(maxAmount, 25))}
        />
      )}
    </div>
  );
};

type DaoTransfersProps = {
  daoTransfers: DaoTransfer[];
  max_amount: number;
};
const DaoTransfers = ({
  daoTransfers,
  max_amount = daoTransfers.length,
}: DaoTransfersProps): JSX.Element => {
  const transfers = daoTransfers.slice(0, max_amount);
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
            <div className="text-right">
              <TokenAmount
                className="font-bold"
                amount={transfer.amount}
                tokenDecimals={transfer.decimals}
                symbol={transfer.tokenSymbol}
                sign={transfertypeToSign(transfer.type)}
              />
              <Address
                address={daoTransferAddress(transfer)}
                maxLength={10}
                hasLink={true}
                showCopy={true}
              />
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
  const [maxAmount, setMaxAmount] = useState(3);
  if (loading) return <Loader></Loader>;
  if (error) return <h3>{error}</h3>;
  if (!daoTransfers) return <h3>No transfers could be loaded</h3>;
  return (
    <div>
      {DaoTransfers({ daoTransfers, max_amount: maxAmount })}
      {/* TODO make this button DO something */}
      {maxAmount < daoTransfers.length && (
        <Button
          className="my-4"
          variant="outline"
          label="Show more transfers"
          onClick={() => {
            setMaxAmount(maxAmount + Math.min(maxAmount, 25));
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
          aside={<Button label="New transfer" icon={HiPlus}></Button>}
        ></HeaderCard>
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
