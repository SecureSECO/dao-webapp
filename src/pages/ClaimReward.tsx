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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex w-full flex-row gap-x-4">
        <div className="flex flex-col gap-y-1">
          Reputation
          <span>{division}%</span>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <Label
            htmlFor="division"
            className="justify-center text-center"
            tooltip="How to divide the reward between monetary value and repuation"
          >
            Division
          </Label>
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
        <div className="flex flex-col gap-y-1"></div>
        <div className="flex flex-col gap-y-1">
          Monetary
          <span>{100 - division}%</span>
        </div>
      </div>
      <div>
        You can claim:{' '}
        <span className="font-bold">
          <TokenAmount amountFloat={reputation} symbol="reputation token" />
        </span>{' '}
        and{' '}
        <span className="font-bold">
          <TokenAmount amountFloat={monetary} symbol="monetary token" />
        </span>
      </div>
      <Button label="Claim" />
    </form>
  );
};
