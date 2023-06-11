import { useState } from 'react';
import DAI from '@/src/components/icons/DAI';
import Secoin from '@/src/components/icons/Secoin';
import { Button } from '@/src/components/ui/Button';
import {
  ConditionalButton,
  ConnectWalletWarning,
  InsufficientGasWarning,
} from '@/src/components/ui/ConditionalButton';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/Popover';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { TOKENS } from '@/src/lib/constants/tokens';
import { Control, Controller, UseFormRegister, useForm } from 'react-hook-form';
import {
  HiArrowsRightLeft,
  HiCog6Tooth,
  HiOutlineArrowsUpDown,
} from 'react-icons/hi2';
import { useAccount } from 'wagmi';

const abcTokens = [
  {
    name: 'DAI',
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', //on polygon mumbai
  },
  {
    name: TOKENS.secoin.symbol,
  },
];

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'DAI':
      return <DAI className="h-5 w-5" />;
    case TOKENS.secoin.symbol:
      return <Secoin className="h-5 w-5 text-white stroke-primary" />;
    default:
      return null;
  }
};

interface IFormInputs {
  fromToken: number;
  slippage: string;
}
const Swap = () => {
  const { register, control, handleSubmit, setValue } = useForm<IFormInputs>({
    defaultValues: {
      slippage: '1', // 1% as default
    },
    shouldUnregister: false,
  });

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
  };

  const max = 100;

  const setMaxValue = () => {
    setValue('fromToken', 100);
  };

  const { secoinAddress } = useDiamondSDKContext();
  const { address, isConnected } = useAccount();

  const [swap, setSwap] = useState(false);
  const amount = 0;
  const enoughGas = true;

  return (
    <div className="w-full min-h-full flex items-center justify-center">
      <MainCard
        header="Swap"
        icon={HiArrowsRightLeft}
        className="max-w-[40rem] relative" // Add relative here
        aside={<SwapSettings control={control} register={register} />}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* From token */}
          <Label>From:</Label>
          <div className="flex p-4 h-24 bg-popover text-popover-foreground rounded-md border border-input">
            <Input
              {...register('fromToken')}
              type="number"
              className="border-none text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] focus:ring-0 focus:ring-offset-0"
              min={'0.000000000000000001'}
              step={'0.000000000000000001'}
              placeholder={'0.0'}
            />
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-full bg-primary w-fit h-fit px-2 py-0.5 flex gap-x-2 items-center justify-center text-primary-foreground">
                <Icon name={swap ? abcTokens[1].name : abcTokens[0].name} />
                {swap ? abcTokens[1].name : abcTokens[0].name}
              </div>
              <MaxButton max={max} setMaxValue={setMaxValue} />
            </div>
          </div>
          {/* Swap button */}
          <div className="absolute left-1/2 -translate-y-5 -translate-x-1/2">
            <Button
              onClick={() => {
                setSwap(!swap);
              }}
              className="h-8 px-0 w-8"
              type="button"
            >
              <span className="sr-only">Swap order</span>
              <HiOutlineArrowsUpDown className="h-5 w-5" />
            </Button>
          </div>
          {/* To token */}
          <div className="flex p-4 h-24 bg-popover text-popover-foreground rounded-md border border-input">
            <span className="text-2xl text-popover-foreground/70 w-full px-3">
              {amount}
            </span>
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-full bg-primary w-fit h-fit px-2 py-0.5 flex gap-x-2 items-center justify-center text-primary-foreground">
                <Icon name={swap ? abcTokens[0].name : abcTokens[1].name} />
                {swap ? abcTokens[0].name : abcTokens[1].name}
              </div>
            </div>
          </div>
          {/* Submit button */}
          <ConditionalButton
            className="leading-4 w-full mb-1"
            flex="flex-col"
            conditions={[
              {
                when: !isConnected,
                content: <ConnectWalletWarning action="to swap" />,
              },
              {
                when: !enoughGas,
                content: <InsufficientGasWarning />,
              },
            ]}
            type="submit"
          >
            Swap
          </ConditionalButton>
        </form>
      </MainCard>
    </div>
  );
};
export default Swap;

const MaxButton = ({
  max,
  setMaxValue,
}: {
  max: number;
  setMaxValue: () => void;
}) => {
  return (
    <div className="inline-flex items-center justify-center gap-x-1">
      {max}
      <button
        type="button"
        onClick={setMaxValue}
        className="w-full p-1 h-fit text-blue-500 underline underline-offset-2 active:scale-95 hover:text-blue-300"
      >
        Max
      </button>
    </div>
  );
};

export const SwapSettings = ({
  control,
  register,
}: {
  control: Control<IFormInputs, any>;
  register: UseFormRegister<IFormInputs>;
}) => {
  const slippageOptions = ['0.5', '1', '2'];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 p-0" type="button">
          <span className="sr-only">Swap settings</span>
          <HiCog6Tooth className="h-5 w-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Slippage Tolerance</h4>
            <p className="text-sm text-muted-foreground">
              Set the slippage tolerance for the swap.
            </p>
          </div>
          <Controller
            control={control}
            name="slippage"
            render={({ field: { onChange, value, name } }) => (
              <RadioGroup onChange={onChange} defaultValue={value} name={name}>
                {slippageOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`s-${option}`} />
                    <Label htmlFor={`s-${option}`}>{option}%</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="s-custom" />
                  <Label htmlFor="s-custom">
                    <Input
                      type="number"
                      className="h-8"
                      min={0}
                      max={100}
                      step={0.1}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
