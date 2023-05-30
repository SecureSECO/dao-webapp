/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { ContractTransactionToast, toast } from '@/src/hooks/useToast';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { NumberPattern } from '@/src/lib/constants/patterns';
import { TOKENS } from '@/src/lib/constants/tokens';
import { parseTokenAmount } from '@/src/lib/utils/token';
import { BigNumber } from 'ethers';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiChevronLeft } from 'react-icons/hi2';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';

import Loading from '../icons/Loading';
import { Address } from '../ui/Address';
import { Card } from '../ui/Card';
import {
  ConditionalButton,
  ConnectWalletWarning,
  Warning,
} from '../ui/ConditionalButton';
import { ErrorWrapper } from '../ui/ErrorWrapper';
import Header from '../ui/Header';
import { LabelledInput } from '../ui/Input';
import { Label } from '../ui/Label';
import { Link } from '../ui/Link';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { useSecoinBalance } from '@/src/hooks/useSecoinBalance';

type DepositAssetsData = {
  token: Token;
  amount?: string;
};
type AddressString = `0x${string}`;
type TokenData =
  | {
      address: AddressString;
      isNativeToken: boolean;
      decimals: number;
    }
  | undefined;

type Token = (typeof Tokens)[number];
// All tokens (including native tokens)
// NOTE: Currently, only tokens with exactly 18 decimals are supported
const Tokens = ['Matic', 'SECOIN', 'Other'] as const;

export const DepositAssets = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<DepositAssetsData>({});
  // Context
  const { daoAddress, secoinAddress } = useDiamondSDKContext();
  const { isConnected, address } = useAccount();
  const { secoinBalance } = useSecoinBalance({ address });
  const { data: maticData } = useBalance({ address });
  const { chain } = useNetwork();

  // Creating 'tokens', the object displaying known tokens that can be deposited through this component, using ERC20 contract writes or native token transaction.
  const secoin: TokenData = secoinAddress
    ? {
        address: secoinAddress as AddressString,
        isNativeToken: false,
        decimals: TOKENS.secoin.decimals,
      }
    : undefined;
  const tokens: Record<Token, TokenData> = {
    Matic: {
      address: '0x0000000000000000000000000000000000001010',
      isNativeToken: true,
      decimals: PREFERRED_NETWORK_METADATA.nativeCurrency.decimals,
    },
    SECOIN: secoin,
    Other: undefined,
  };

  // Adding watches + their derivatives
  const watchToken = useWatch({ control: control, name: 'token' });
  const token = tokens[watchToken];
  const isKnownToken = watchToken !== undefined && watchToken !== 'Other';

  const watchAmount = useWatch({ control: control, name: 'amount' });
  const amount = parseTokenAmount(watchAmount, token?.decimals);

  // Hooks for non native tokens
  const debouncedTokenId = useDebounce(
    [amount ?? BigNumber.from(0), token?.address],
    500
  );
  const { config, error } = usePrepareContractWrite({
    address: token?.address,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [daoAddress as AddressString, amount ?? BigNumber.from(0)],
    enabled: Boolean(debouncedTokenId) && !token?.isNativeToken,
  });

  const { writeAsync } = useContractWrite(config);

  // Hooks for native tokens
  const { config: configNative, error: errorNative } =
    usePrepareSendTransaction({
      request: { to: daoAddress as string, value: amount ?? BigNumber.from(0) },
      chainId: PREFERRED_NETWORK_METADATA.id,
      enabled: Boolean(debouncedTokenId) && token?.isNativeToken,
    });

  const { sendTransactionAsync } = useSendTransaction(configNative);

  // State for loading symbol during transaction
  const [isSendingTransaction, setIsSendingTransaction] =
    useState<boolean>(false);

  // OnSubmit: First validate data, then send the transaction
  const onSubmit = (data: DepositAssetsData) => {
    //Can only send known tokens
    if (!isKnownToken || data.amount === undefined) {
      setError('root.deposit', {
        type: 'custom',
        message: 'You can only deposit known token types',
      });
      return;
    }
    //Should not happen because submitting is not allowed for undefined tokens
    if (token === undefined) {
      setError('root.deposit', {
        type: 'custom',
        message: 'You cannnot deposit this type of token',
      });
      return;
    }

    if (daoAddress === undefined) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Could not determine DAO address',
      });
      return;
    }

    if (!BigNumber.isBigNumber(amount)) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Incorrect format for amount',
      });
      return;
    }

    const toasterConfig: ContractTransactionToast = {
      success: 'Deposit successful!',
      error: 'Deposit failed',
      onFinish: () => {
        setIsSendingTransaction(false);
      },
    };

    if (token.isNativeToken) {
      if (errorNative !== null) {
        setError('root.deposit', {
          type: 'custom',
          message: 'Could not create transaction',
        });
        console.log(error);
        return;
      }

      if (!sendTransactionAsync) {
        setError('root.deposit', {
          type: 'custom',
          message: 'Could not create transaction',
        });
        return;
      }

      // send transaction (Note that the toast will set the loading state to false)
      setIsSendingTransaction(true);
      toast.contractTransaction(() => sendTransactionAsync(), toasterConfig);
    } else {
      if (error !== null) {
        setError('root.deposit', {
          type: 'custom',
          message: 'Could not create transaction',
        });
        console.log(error);
        return;
      }

      if (!writeAsync) {
        setError('root.deposit', {
          type: 'custom',
          message: 'Could not create transaction',
        });
        return;
      }
      // send transaction (Note that the toast will set the loading state to false)
      setIsSendingTransaction(true);
      toast.contractTransaction(() => writeAsync(), toasterConfig);
    }
  };

  return (
    <div className="space-y-2">
      {/* Back button */}
      <Link
        to="/finance"
        icon={HiChevronLeft}
        variant="outline"
        label="All transfers"
        className="text-lg"
      />
      <Card className="space-y-4">
        <Header className="">Deposit assets</Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <Label tooltip="Asset to deposit" htmlFor="token">
                  Token
                </Label>
                <ErrorWrapper name="token" error={errors?.token}>
                  <Controller
                    control={control}
                    name="token"
                    rules={{ required: true }}
                    render={({ field: { onChange, name, value } }) => (
                      <Select
                        defaultValue={value}
                        onValueChange={onChange}
                        name={name}
                        disabled={isSendingTransaction}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tokens</SelectLabel>
                            {Tokens.map((token) => (
                              <SelectItem key={token} value={token}>
                                {token}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </ErrorWrapper>
              </div>
              {watchToken !== 'Other' && (
                <LabelledInput
                  {...register('amount', {
                    validate: (v) => {
                      // only Validate if this is active
                      if (!isKnownToken) return true;

                      // Required
                      if (v === undefined || v === '')
                        return 'Please enter an amount';

                      // Number Pattern
                      if (!NumberPattern.test(v))
                        return 'Please enter a number, e.g. 3.141';

                      // Otherwise this is valid
                      return true;
                    },
                  })}
                  id="amount"
                  tooltip={`Amount of ${watchToken} to deposit`}
                  label="Amount"
                  error={errors.amount}
                  disabled={!isKnownToken || isSendingTransaction}
                />
              )}
            </div>
            {watchToken === 'Other' ? (
              <div className="space-y-1">
                <p className="">
                  Copy the address and use your wallet&apos;s send feature to
                  send assets to the DAO&apos;s treasury.
                </p>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Card variant="outline">
                    <Address address={daoAddress ?? ''} showCopy hasLink />
                  </Card>
                </div>
              </div>
            ) : (
              <ErrorWrapper name="deposit" error={errors?.root?.deposit as any}>
                <div className="flex flex-row gap-x-2">
                  <ConditionalButton
                    label="Deposit assets"
                    disabled={!isKnownToken || isSendingTransaction}
                    icon={isSendingTransaction ? Loading : null}
                    conditions={[
                      {
                        when: !isConnected,
                        content: <ConnectWalletWarning action="to deposit" />,
                      },
                      {
                        when: chain?.id !== PREFERRED_NETWORK_METADATA.id,
                        content: (
                          <Warning> Switch network to deposit assets </Warning>
                        ),
                      },
                      {
                        when:
                          watchToken === 'Matic' &&
                          maticData !== undefined &&
                          amount !== null &&
                          amount.gt(maticData.value),
                        content: (
                          <Warning>
                            You do not have enough {maticData?.symbol} to
                            deposit
                          </Warning>
                        ),
                      },
                      {
                        when:
                          watchToken === 'SECOIN' &&
                          amount !== null &&
                          amount.gt(secoinBalance),
                        content: (
                          <Warning>
                            You do not have enough {TOKENS.secoin.symbol} to
                            deposit
                          </Warning>
                        ),
                      },
                    ]}
                  />
                </div>
              </ErrorWrapper>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
