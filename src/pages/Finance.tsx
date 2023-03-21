import { HiArrowRight, HiArrowSmallRight, HiPlus } from 'react-icons/hi2';
import { Address } from '../components/ui/Address';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HeaderCard } from '../components/ui/HeaderCard';
import Loader from '../components/ui/Loader';
import { DaoBalance, DaoBalances, useDaoBalance } from '../hooks/useDaoBalance';

type tokenProps = {
  daoBalances: DaoBalances;
  max_amount: number;
};

const DaoTokens = ({
  daoBalances,
  max_amount = daoBalances.length,
}: tokenProps): JSX.Element => {
  const balances = daoBalances
    .slice() //Copies array
    .sort((a, b) => (a.updateDate < b.updateDate ? 1 : -1))
    .slice(0, max_amount);

  return (
    <div className="mt-4 space-y-4">
      {balances.map((balance: DaoBalance) => (
        <Card padding="sm" variant="light" className="p-4 dark:bg-slate-700/50">
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

const bigIntToFloat = (
  value: BigInt | null,
  decimals: number | null,
  onError: string = '-'
): number => parseFloat(value && decimals ? `${value}E-${decimals}` : onError);

const Finance = () => {
  const { daoBalances, loading, error } = useDaoBalance({});

  const DaoTokensWrapped = (): JSX.Element => {
    if (loading) return <Loader></Loader>;
    if (error) return <h3>{error}</h3>;

    return DaoTokens({ daoBalances: daoBalances, max_amount: 3 });
  };

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
        </Card>
      </div>
    </div>
  );
};

export default Finance;
