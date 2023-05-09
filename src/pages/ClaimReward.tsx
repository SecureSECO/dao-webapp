/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ClaimRewardData = {
  division: number;
};

import { Controller, useForm, useWatch } from 'react-hook-form';
import { Label } from '../components/ui/Label';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import TokenAmount from '../components/ui/TokenAmount';
import { MainCard } from '../components/ui/MainCard';
import { IconBaseProps } from 'react-icons/lib';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { Card } from '../components/ui/Card';
import { TOKENS } from '../lib/constants/tokens';

/*
 * repToBeClaimed is the total amount of reputation the user may claim
 * repToMonetaryFactor is the amount of monetary token 1 rep may be converted to.
 * */
export const ClaimReward = ({
  repToBeClaimed,
  repToMonetaryFactor,
}: {
  repToBeClaimed: number;
  repToMonetaryFactor: number;
}) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<ClaimRewardData>({
    defaultValues: { division: 100 },
  });

  const name_division = 'division';

  const division = useWatch({
    control,
    name: name_division,
  });

  const reputation = division * repToBeClaimed * 0.01 || 0;
  const monetary =
    (100 - division) * repToBeClaimed * repToMonetaryFactor * 0.01 || 0;

  const onSubmit = (data: ClaimRewardData) => {
    console.log(data);
  };

  return (
    <MainCard icon={HiOutlineCurrencyDollar} header="Claim Reward">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <Label
          htmlFor="division"
          tooltip="How to divide the reward between monetary value and repuation"
        >
          Reward division
        </Label>
        <Card
          variant="outline"
          className="grid w-full grid-cols-8 gap-x-4 gap-y-4 text-center md:flex md:flex-row"
        >
          <div className="col-span-4 flex flex-col gap-y-1">
            {TOKENS.rep.symbol}
            <span>{division}%</span>
          </div>
          <div className="col-span-4 flex flex-col gap-y-1 md:order-last">
            {TOKENS.secoin.symbol}
            <span>{100 - division}%</span>
          </div>
          <div className="col-span-8 flex flex-col justify-center gap-y-2 md:w-full">
            <Controller
              control={control}
              name={name_division}
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
        <div className="mt-1 flex w-full flex-col gap-x-2 gap-y-2 md:flex-row">
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
