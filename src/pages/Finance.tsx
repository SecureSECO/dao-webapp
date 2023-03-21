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
            <span>
              {bigIntToFloat(balance.balance, balance.decimals).toFixed(2)}
              &nbsp;{balance.symbol ?? ''}
            </span>
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
  if (loading) return <Loader></Loader>;
  if (error) return <h3>{error}</h3>;
  return DaoTokens({ daoBalances: daoBalances, max_amount: 3 });
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
  console.log(transfers);
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
              <span className="font-bold">
                {transfer.type === TransferType.WITHDRAW ? '-' : '+'}
                {bigIntToFloat(
                  transfer.amount ?? 1n,
                  transfer.decimals ?? 0
                ).toFixed(2)}{' '}
                &nbsp;{transfer.tokenSymbol ?? ''}
              </span>
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
  if (loading) return <Loader></Loader>;
  if (error) return <h3>{error}</h3>;
  if (!daoTransfers) return <h3>No transfers could be loaded</h3>;
  return DaoTransfers({ daoTransfers, max_amount: 3 });
};

const bigIntToFloat = (
  value: BigInt | null,
  decimals: number | null,
  onError: string = '-'
): number => parseFloat(value && decimals ? `${value}E-${decimals}` : onError);

const Finance = () => {
  return (
    <div>
      <div className="flex flex-col gap-6">
        <HeaderCard
          title="Finance"
          aside={<Button label="New transfer" icon={HiPlus}></Button>}
        ></HeaderCard>
      </div>
      <div className="my-6 grid grid-cols-2 gap-4">
        <Card>
          <h2 className="text-xl font-bold">Tokens</h2>
          <DaoTokensWrapped />
          {/* //TODO make this button DO something */}
          <Button
            className="my-4"
            variant="outline"
            label="See all tokens"
            icon={HiArrowSmallRight}
          ></Button>
        </Card>
        <Card>
          <h2 className="text-xl font-bold">Latest transfers</h2>
          <DaoTransfersWrapped />
          {/* TODO make this button DO something */}
          <Button
            className="my-4"
            variant="outline"
            label="See all transfers"
            icon={HiArrowSmallRight}
          />
        </Card>
      </div>
    </div>
  );
};

export default Finance;
