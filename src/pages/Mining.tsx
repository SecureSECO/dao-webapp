/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import {
  ConditionalButton,
  ConnectWalletWarning,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import {
  DataTable,
  HeaderSortableDecorator,
} from '@/src/components/ui/DataTable';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import { Slider } from '@/src/components/ui/Slider';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { useSearchSECO } from '@/src/hooks/useSearchSECO';
import { toast } from '@/src/hooks/useToast';
import { TOKENS } from '@/src/lib/constants/tokens';
import { mapRange } from '@/src/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiOutlineCommandLine, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { useAccount } from 'wagmi';

export type ClaimRewardData = {
  distribution: number;
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
        Total Hashes
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

/**
 * Page for claiming rewards for and viewing your SearchSECO miners
 */
export const Mining = () => {
  const { control, handleSubmit } = useForm<ClaimRewardData>({
    defaultValues: { distribution: 100 },
  });
  const { isConnected } = useAccount();

  const {
    miningData,
    claimReward,
    totalClaimedHashes,
    getMiningData,
    estimateRewardSplit,
  } = useSearchSECO();

  const [isBusy, setIsBusy] = useState(false);

  const totalMinedHashes = miningData?.reduce(
    (acc, miner) => acc + miner.claimableHashes,
    0
  );

  const claimableHashes =
    miningData && totalMinedHashes && totalClaimedHashes
      ? totalMinedHashes - totalClaimedHashes?.toNumber()
      : 0;

  const name_distribution = 'distribution';

  const _distribution = useWatch({
    control,
    name: name_distribution,
  });

  const distribution = Array.isArray(_distribution) // for some reason _distribution is an array when value != 100
    ? _distribution[0]
    : _distribution;

  const [reputation, setReputation] = useState<BigNumber | null>(null);
  const [monetary, setMonetary] = useState<BigNumber | null>(null);

  useEffect(() => {
    const updateEstimate = setTimeout(async () => {
      if (!claimableHashes) return;

      const [repEst, monEst] = await estimateRewardSplit(
        BigNumber.from(claimableHashes),
        BigNumber.from(Math.round(mapRange(distribution, 0, 100, 0, 1000000)))
      );
      setReputation(repEst);
      setMonetary(monEst);
    }, 500);

    return () => clearTimeout(updateEstimate);
  }, [distribution, claimableHashes]);

  const onSubmit = (data: ClaimRewardData) => {
    if (isBusy) return;

    const distribution = Array.isArray(data.distribution)
      ? data.distribution[0]
      : data.distribution;
    const repFrac = BigNumber.from(
      Math.round(mapRange(distribution, 0, 100, 0, 100000))
    );

    toast.contractTransaction(
      () => claimReward(BigNumber.from(totalMinedHashes), repFrac),
      {
        success: `Successfully claimed reward!`,
        error: `Failed to claim reward`,
        onFinish() {
          setIsBusy(false);
          getMiningData();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <HeaderCard title="SearchSECO" />
      <div className="grid grid-cols-7 gap-6">
        <MainCard
          icon={HiOutlineCurrencyDollar}
          header="Claim rewards"
          className="col-span-3"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-y-1">
              <Label
                tooltip={`The total amount of hashes you can claim your reward for`}
              >
                Claimable hashes
              </Label>
              <Card variant="outline">{claimableHashes} hashes</Card>
            </div>
            <div className="flex flex-col gap-y-1">
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
            </div>
            <ConditionalButton
              label="Claim reward"
              className="mt-1"
              conditions={[
                {
                  when: !isConnected,
                  content: <ConnectWalletWarning action="to claim" />,
                },
                {
                  when: claimableHashes <= 0,
                  content: <Warning>You have no reward to claim</Warning>,
                },
              ]}
            />
          </form>
        </MainCard>

        <MainCard
          icon={HiOutlineCommandLine}
          header="Miners"
          className="col-span-4"
        >
          {miningData && miningData.length > 0 ? (
            <div className="space-y-1">
              <Label
                tooltip={`This table shows the miners connected to your wallet`}
              >
                Miner data
              </Label>
              <DataTable columns={columns} data={miningData} />
            </div>
          ) : (
            <p className="text-highlight-foreground/80 italic">
              No miners found
            </p>
          )}
        </MainCard>
      </div>
    </div>
  );
};
