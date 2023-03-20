import { AssetBalance } from '@aragon/sdk-client';
import React from 'react';
import { Card } from '../components/ui/Card';
import { HeaderCard } from '../components/ui/HeaderCard';
import Loader from '../components/ui/Loader';
import { MainCard } from '../components/ui/MainCard';
import { DaoBalances, useDaoBalance } from '../hooks/useDaoBalance';

const Finance = () => {
  const { daoBalances, loading, error } = useDaoBalance({});

  console.log(daoBalances);

  const bigIntToFloat = (
    value: BigInt | null,
    decimals: number | null,
    onError = '-'
  ): number =>
    parseFloat(value && decimals ? `${value}E-${decimals}` : onError);

  const DaoTokens = (): JSX.Element => {
    if (loading) return <Loader></Loader>;

    return (
      <div>
        {daoBalances.map((balance) => (
          <div>
            {bigIntToFloat(balance.balance, balance.decimals).toFixed(2)}
            &nbsp;{balance.symbol ?? ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <HeaderCard
          title="Finance"
          btnLabel="New transfer"
          btnOnClick={() => console.log('New members Clicked')}
        ></HeaderCard>
      </div>
      <Card className="my-6">
        <h2 className="text-xl font-bold">Tokens</h2>
        <DaoTokens />
      </Card>
    </div>
  );
};

export default Finance;
