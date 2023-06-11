import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  DataTable,
  HeaderSortableDecorator,
} from '@/src/components/ui/DataTable';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import { Slider } from '@/src/components/ui/Slider';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { useSearchSECO } from '@/src/hooks/useSearchSECO';
import { toast } from '@/src/hooks/useToast';
import { TOKENS } from '@/src/lib/constants/tokens';
import { ColumnDef } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ClaimRewardData = {
  distribution: number;
};

export const Mining = () => {
  //TODO: implement with SDK
  const repToMonetaryFactor = 0.3;
  return <ClaimReward repToMonetaryFactor={repToMonetaryFactor} />;
};

type DisplayMining = {
  minerId: string;
  claimableHashes: number;
  status: string;
};

const columns: ColumnDef<DisplayMining>[] = [
  {
    accessorKey: 'minerId',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>
        Miner ID
      </HeaderSortableDecorator>
    ),
  },
  {
    accessorKey: 'claimableHashes',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>
        Claimable Hashes
      </HeaderSortableDecorator>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <HeaderSortableDecorator column={column}>Status</HeaderSortableDecorator>
    ),
  },
];

/*
 * @param props.claimableRep Total amount of reputation the user can claim
 * @param props.repToMonetaryFactor Amount of monetary token 1 rep may be converted to
 * */
export const ClaimReward = ({
  repToMonetaryFactor,
}: {
  repToMonetaryFactor: number;
}) => {
  const { control, handleSubmit } = useForm<ClaimRewardData>({
    defaultValues: { distribution: 100 },
  });

  const { miningData, hashReward, claimReward } = useSearchSECO();

  const [isBusy, setIsBusy] = useState(false);

  const totalHashes = miningData?.reduce(
    (acc, miner) => acc + miner.claimableHashes,
    0
  );

  const claimableRep: BigNumber =
    miningData != null && hashReward != null && totalHashes != null
      ? hashReward.mul(totalHashes)
      : BigNumber.from(0);

  const name_distribution = 'distribution';

  const _distribution = useWatch({
    control,
    name: name_distribution,
  });

  const distribution = Array.isArray(_distribution) // for some reason _distribution is an array when value != 100
    ? _distribution[0]
    : _distribution;

  const reputation = claimableRep.mul(BigNumber.from(distribution)).div(100);
  const monetary = claimableRep
    .mul(BigNumber.from(100 - distribution))
    .div(100)
    .mul(BigNumber.from(Math.round(repToMonetaryFactor * 100)))
    .div(100);

  function mapRange(
    value: number,
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number
  ): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }

  const onSubmit = (data: ClaimRewardData) => {
    if (isBusy) return;

    const distribution = Array.isArray(data.distribution)
      ? data.distribution[0]
      : data.distribution;
    const repFrac = BigNumber.from(
      Math.round(mapRange(distribution, 0, 100, 0, 100000))
    );

    toast.contractTransaction(
      () => claimReward(BigNumber.from(totalHashes), repFrac),
      {
        success: `Successfully claimed reward!`,
        error: `Failed to claim reward`,
        onFinish() {
          setIsBusy(false);
        },
      }
    );
  };

  return (
    <MainCard icon={HiOutlineCurrencyDollar} header="Claim Reward">
      {miningData ? (
        <div className="mb-8 flex flex-col gap-1">
          <Label
            tooltip={`You can see the miners that are connected to your wallet in the table below`}
          >
            Miner Data
          </Label>
          <DataTable columns={columns} data={miningData} />
        </div>
      ) : (
        <Card loading={true} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <Label
          htmlFor="distribution"
          tooltip={`How much of your reward you wish to receive in ${TOKENS.rep.symbol}, and how much in ${TOKENS.secoin.symbol}`}
        >
          Reward distribution
        </Label>
        <Card
          variant="outline"
          className="grid w-full grid-cols-8 gap-4 text-center md:flex md:flex-row"
        >
          <div className="col-span-4 flex flex-col">
            {TOKENS.rep.symbol}
            <span>{distribution}%</span>
          </div>
          <div className="col-span-4 flex flex-col md:order-last">
            {TOKENS.secoin.symbol}
            <span>{100 - distribution}%</span>
          </div>
          <div className="col-span-8 flex flex-col justify-center gap-y-2 md:w-full">
            <Controller
              control={control}
              name={name_distribution}
              render={({ field: { onChange, name, value } }) => (
                <Slider
                  defaultValue={[value]}
                  max={100}
                  step={1}
                  onValueChange={onChange}
                  name={name}
                />
              )}
            />
          </div>
        </Card>
        <div className="mt-1 flex w-full flex-col gap-2 md:flex-row">
          <Card variant="outline">
            <TokenAmount
              amount={reputation}
              tokenDecimals={18}
              symbol={TOKENS.rep.symbol}
              displayDecimals={3}
            />
          </Card>
          <Card variant="outline">
            <TokenAmount
              amount={monetary}
              tokenDecimals={18}
              symbol={TOKENS.secoin.symbol}
              displayDecimals={3}
            />
          </Card>
        </div>
        <Button
          label="Claim reward"
          className="mt-1"
          disabled={isBusy || claimableRep.lte(0)}
        />
      </form>
    </MainCard>
  );
};
