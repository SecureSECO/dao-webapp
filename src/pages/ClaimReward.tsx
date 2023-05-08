/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ClaimRewardData = {
  name: string;
  division: number;
};

import { Controller, useForm, useWatch } from 'react-hook-form';
import { Label } from '../components/ui/Label';
import { Slider } from '../components/ui/Slider';

export const ClaimReward = ({}) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<ClaimRewardData>({
    defaultValues: { name: 'onzin', division: 50 },
  });

  const name_division = 'division';

  const division = useWatch({
    control,
    name: name_division,
  });

  const onSubmit = (data: ClaimRewardData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-center"
    >
      <div className="flex flex-row gap-x-4">
        <div className="flex flex-col gap-y-1">
          Monetary
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
          Reputation
          <span>{100 - division}%</span>
        </div>
      </div>
    </form>
  );
};
