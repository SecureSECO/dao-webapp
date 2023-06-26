/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import DAI from '@/src/components/icons/DAI';
import Loading from '@/src/components/icons/Loading';
import Secoin from '@/src/components/icons/Secoin';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { Button } from '@/src/components/ui/Button';
import CategoryList from '@/src/components/ui/CategoryList';
import {
  ConditionalButton,
  ConnectWalletWarning,
  InsufficientGasWarning,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import { ErrorText } from '@/src/components/ui/ErrorWrapper';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import { MaxButton } from '@/src/components/ui/MaxButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/Popover';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { applySlippage, useMarketMaker } from '@/src/hooks/useMarketMaker';
import { useSecoinBalance } from '@/src/hooks/useSecoinBalance';
import { toast } from '@/src/hooks/useToast';
import {
  PREFERRED_NETWORK,
  PREFERRED_NETWORK_METADATA,
} from '@/src/lib/constants/chains';
import { NumberPattern } from '@/src/lib/constants/patterns';
import { TOKENS } from '@/src/lib/constants/tokens';
import { cn, isNullOrUndefined } from '@/src/lib/utils';
import { parseTokenAmount } from '@/src/lib/utils/token';
import { BigNumber, constants, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useForm,
  useWatch,
} from 'react-hook-form';
import {
  HiArrowsRightLeft,
  HiCog6Tooth,
  HiOutlineArrowsUpDown,
} from 'react-icons/hi2';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

const abcTokens = [
  {
    name: 'DAI',
    contractAddress: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', //on polygon mumbai
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

const decimals = 18;

interface IFormInputs {
  fromToken: string;
  slippage: string;
}
const Swap = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    defaultValues: {
      slippage: '1', // 1% as default
      fromToken: '0.0',
    },
    shouldUnregister: false,
    mode: 'onChange',
  });

  // BALANCES
  const { address, isConnected } = useAccount();
  const { secoinBalance } = useSecoinBalance({ address, watch: true });
  const { data: daiBalance } = useBalance({
    address,
    token: abcTokens[0].contractAddress as any,
    watch: true,
  });

  const [isSwapping, setIsSwapping] = useState(false);

  const { data: nativeBalance } = useBalance({ address: address });

  const slippageWatch = useWatch({ control, name: 'slippage' });
  const slippage = parseFloat(slippageWatch);
  const fromAmountWatch = useWatch({ control, name: 'fromToken' });
  const fromAmount = parseTokenAmount(fromAmountWatch, decimals);

  const [swap, setSwap] = useState<'Mint' | 'Burn'>('Mint');
  const from = swap === 'Mint' ? abcTokens[0] : abcTokens[1];
  const to = swap === 'Mint' ? abcTokens[1] : abcTokens[0];

  let maxFrom = swap === 'Mint' ? daiBalance?.value : secoinBalance;
  let maxTo = swap === 'Mint' ? secoinBalance : daiBalance?.value;

  useEffect(() => {
    maxFrom = swap === 'Mint' ? daiBalance?.value : secoinBalance;
    maxTo = swap === 'Mint' ? secoinBalance : daiBalance?.value;
  }, [daiBalance, secoinBalance]);

  const setMaxValue = () => {
    if (maxFrom !== undefined) {
      setValue('fromToken', formatUnits(maxFrom, decimals));
    }
  };

  const {
    isLoading,
    error,
    estimatedGas,
    expectedReturn,
    performSwap,
    contractAddress: swapContractAddress,
  } = useMarketMaker({
    amount: fromAmount,
    swapKind: swap,
    slippage: slippage,
    enabled: fromAmount !== null && !isNaN(slippage),
  });

  const { data: approvedAmount } = useContractRead({
    address: abcTokens[0].contractAddress as any, // DAI address
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as any, swapContractAddress as any],
    enabled: swap === 'Mint' && swapContractAddress !== null,
    watch: true,
  });

  const isApproved =
    swap === 'Burn' ||
    (approvedAmount !== undefined &&
      fromAmount !== null &&
      approvedAmount.gte(fromAmount)) ||
    (approvedAmount !== undefined && // In case the input is invalid.
      fromAmount === null &&
      approvedAmount.gte(constants.Zero));

  const { config: approveConfig } = usePrepareContractWrite({
    address: abcTokens[0].contractAddress as any, //always use DAI contract for this.
    abi: erc20ABI,
    functionName: 'approve',
    args: [swapContractAddress as any, ethers.constants.MaxUint256],
    enabled: swap === 'Mint' && swapContractAddress !== null,
  });
  const {
    writeAsync: writeAproveAsync,
    error: approveError,
    isLoading: isLoadingAprove,
  } = useContractWrite(approveConfig);

  const enoughGas =
    estimatedGas !== null && nativeBalance !== undefined
      ? nativeBalance.value.gte(estimatedGas)
      : true;

  const onSubmit = () => {
    setIsSwapping(true);
    toast.contractTransaction(() => performSwap(), {
      success: 'Swap successful',
      error: 'Swap failed',
      onError: (e) => console.error(e as any),
      onFinish() {
        setIsSwapping(false);
        setValue('fromToken', '0.0');
      },
    });
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center">
      <MainCard
        header="ABC Swap"
        icon={HiArrowsRightLeft}
        className="max-w-[40rem] relative gap-y-2" // Add relative here
        aside={
          <SwapSettings
            setValue={setValue}
            errors={errors}
            register={register}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          {PREFERRED_NETWORK === 'mumbai' && (
            <p className="text-destructive">
              You are on the {PREFERRED_NETWORK_METADATA.name} testnet, where
              DAI does not exist. Use{' '}
              <a
                className="underline"
                rel="noopener noreferrer"
                target="_blank"
                href="https://app.uniswap.org/#/swap"
              >
                WMATIC
              </a>{' '}
              instead.
            </p>
          )}
          {/* From token */}
          <Label>From:</Label>
          <div className="flex p-4 h-24 bg-popover text-popover-foreground rounded-md border border-input">
            <Input
              {...register('fromToken', {
                pattern: {
                  value: NumberPattern,
                  message: 'Invalid token amount',
                },
                validate: {
                  max: (v) =>
                    maxFrom === undefined ||
                    (parseTokenAmount(v, decimals) ?? BigNumber.from(0)).lte(
                      maxFrom
                    ) ||
                    'Token amount too high',
                },
              })}
              className="border-none text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] focus:ring-0 focus:ring-offset-0"
              autoFocus
              error={errors.fromToken}
              placeholder={'0.0'}
            />
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-full bg-primary w-fit h-fit px-2 py-0.5 flex gap-x-2 items-center justify-center text-primary-foreground">
                <Icon name={from.name} />
                {from.name}
              </div>
              {maxFrom === undefined || (
                <MaxButton
                  max={maxFrom}
                  decimals={decimals}
                  setMaxValue={setMaxValue}
                />
              )}
            </div>
          </div>
          {/* Swap button */}
          <div className="absolute left-1/2 -translate-y-5 -translate-x-1/2">
            <Button
              onClick={() => {
                setSwap(swap === 'Burn' ? 'Mint' : 'Burn');
                setValue('fromToken', '0.0');
              }}
              className="h-8 px-0 w-8"
              type="button"
              disabled={isSwapping}
            >
              <span className="sr-only">Swap order</span>
              <HiOutlineArrowsUpDown className="h-5 w-5" />
            </Button>
          </div>
          {/* To token */}
          <div className="flex p-4 h-24 w-full bg-popover text-popover-foreground rounded-md border border-input">
            <span className="text-2xl text-popover-foreground/70 w-full shrink truncate px-3">
              <TokenAmount
                amount={expectedReturn}
                tokenDecimals={decimals}
                displayDecimals={decimals}
                showSmallAmounts
              />
            </span>
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-full bg-primary w-fit h-fit px-2 py-0.5 flex gap-x-2 items-center justify-center text-primary-foreground">
                <Icon name={to.name} />
                {to.name}
              </div>
              <TokenAmount amount={maxTo} tokenDecimals={decimals} />
            </div>
          </div>
          <ErrorText name="Token amount" error={errors.fromToken} />
          {/* Approve button */}
          {isConnected && !isApproved && (
            <ConditionalButton
              className="leading-4 w-full mb-1"
              flex="flex-col"
              conditions={[
                {
                  when: !isConnected,
                  content: <ConnectWalletWarning action="to approve" />,
                },
                {
                  when: approveError !== null,
                  content: <Warning>Could not approve</Warning>,
                },
                {
                  when: writeAproveAsync === undefined || isLoadingAprove,
                  content: <Loading className="w-5 h-5" />,
                },
              ]}
              type="button"
              disabled={isApproved}
              onClick={() =>
                toast.contractTransaction(() => writeAproveAsync!(), {
                  success: 'Approved!',
                  error: 'Approving failed',
                })
              }
            >
              Approve
            </ConditionalButton>
          )}

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
              {
                when: !isValid,
                content: <Warning>Form input is invalid</Warning>,
              },
              {
                when: isLoading || isSwapping,
                content: <Loading className="w-5 h-5" />,
              },
              {
                when: fromAmount !== null && fromAmount.eq(constants.Zero),
                content: <Warning>{from.name} amount is zero</Warning>,
              },
              {
                when: error !== null,
                content: <Warning>{error!}</Warning>,
              },
              {
                when: !isApproved,
                content: <Warning>Approve first before swapping</Warning>,
              },
            ]}
            type="submit"
          >
            Swap
          </ConditionalButton>
        </form>
        <hr className="border-2 border-accent" />
        <Accordion
          type="single"
          collapsible
          className="space-y-2"
          defaultValue="0"
        >
          <AccordionItem value="0">
            <AccordionTrigger className="flex w-full flex-col">
              <p className="lowercase first-letter:capitalize">Summary</p>
            </AccordionTrigger>
            <AccordionContent className="mt-1">
              <CategoryList
                categories={[
                  {
                    title: 'Gas',
                    items: [
                      {
                        label: 'Estimated gas fee',
                        value: (
                          <TokenAmount
                            amount={estimatedGas}
                            tokenDecimals={
                              PREFERRED_NETWORK_METADATA.nativeToken.decimals
                            }
                            symbol={
                              PREFERRED_NETWORK_METADATA.nativeToken.symbol
                            }
                            showSmallAmounts
                            displayDecimals={8}
                          />
                        ),
                      },
                    ],
                  },
                  {
                    title: 'Value to be received',
                    items: [
                      {
                        label: `Minimum (slippage ${slippageWatch}%)`,
                        value: (
                          <TokenAmount
                            amount={
                              isNullOrUndefined(expectedReturn) ||
                              isNaN(slippage)
                                ? null
                                : applySlippage(expectedReturn, slippage)
                            }
                            tokenDecimals={decimals}
                            symbol={to.name}
                            showSmallAmounts
                            displayDecimals={decimals}
                          />
                        ),
                      },
                      {
                        label: 'Expected',
                        value: (
                          <TokenAmount
                            amount={expectedReturn}
                            tokenDecimals={decimals}
                            symbol={to.name}
                            showSmallAmounts
                            displayDecimals={decimals}
                          />
                        ),
                      },
                    ],
                  },
                ]}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </MainCard>
    </div>
  );
};
export default Swap;

export const SwapSettings = ({
  register,
  setValue,
  errors,
}: {
  register: UseFormRegister<IFormInputs>;
  setValue: UseFormSetValue<IFormInputs>;
  errors: FieldErrors<IFormInputs>;
}) => {
  const slippageOptions = ['0.5', '1', '2'];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-10 p-0',
            errors.slippage && 'bg-destructive-background'
          )}
          type="button"
        >
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
          <div className="flex gap-x-1 items-center justify-center">
            {slippageOptions.map((option) => (
              <Button
                key={option}
                onClick={() => setValue('slippage', option)}
                type="button"
                size="xs"
              >
                {option}%
              </Button>
            ))}
            <Input
              {...register('slippage', {
                required: true,
                min: { value: 0, message: 'Slippage is too low' },
                max: { value: 100, message: 'Slippage is too high' },
                valueAsNumber: true,
              })}
              className="h-8"
              type="number"
              min={0}
              max={100}
              step={0.1}
              error={errors.slippage}
              autoFocus
            />
            <Label>%</Label>
          </div>
          <ErrorText name="Slippage" error={errors.slippage} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
