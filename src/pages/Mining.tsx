import { TOKENS } from '@/src/lib/constants/tokens';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

import { Button } from '.@/src/components/ui/Button';
import { Card } from '.@/src/components/ui/Card';
import { Label } from '.@/src/components/ui/Label';
import { MainCard } from '.@/src/components/ui/MainCard';
import { Slider } from '.@/src/components/ui/Slider';
import TokenAmount from '.@/src/components/ui/TokenAmount';

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
  const claimableRep = 123;
  const repToMonetaryFactor = 0.3;
  return (
    <ClaimReward
      claimableRep={claimableRep}
      repToMonetaryFactor={repToMonetaryFactor}
    />
  );
};

/*
 * @param props.claimableRep Total amount of reputation the user can claim
 * @param props.repToMonetaryFactor Amount of monetary token 1 rep may be converted to
 * */
export const ClaimReward = ({
  claimableRep,
  repToMonetaryFactor,
}: {
  claimableRep: number;
  repToMonetaryFactor: number;
}) => {
  const { control, handleSubmit } = useForm<ClaimRewardData>({
    defaultValues: { distribution: 100 },
  });

  const name_distribution = 'distribution';

  const distribution = useWatch({
    control,
    name: name_distribution,
  });

  const reputation = distribution * claimableRep * 0.01 || 0;
  const monetary =
    (100 - distribution) * claimableRep * repToMonetaryFactor * 0.01 || 0;

  const onSubmit = (data: ClaimRewardData) => {
    console.log(data);
  };

  return (
    <MainCard icon={HiOutlineCurrencyDollar} header="Claim Reward">
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
            <TokenAmount amountFloat={reputation} symbol={TOKENS.rep.symbol} />
          </Card>
          <Card variant="outline">
            <TokenAmount amountFloat={monetary} symbol={TOKENS.secoin.symbol} />
          </Card>
        </div>
        <Button label="Claim reward" className="mt-1" />
      </form>
    </MainCard>
  );
};
