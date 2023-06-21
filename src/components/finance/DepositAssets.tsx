/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import Loading from '@/src/components/icons/Loading';
import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import {
  ConditionalButton,
  ConnectWalletWarning,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import Header from '@/src/components/ui/Header';
import { LabelledInput } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { Link } from '@/src/components/ui/Link';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import {
  Pools,
  TokenData,
  pools,
  useDepositAssets,
} from '@/src/hooks/useDepositAssets';
import { useSecoinBalance } from '@/src/hooks/useSecoinBalance';
import { ContractTransactionToast, toast } from '@/src/hooks/useToast';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { NumberPattern } from '@/src/lib/constants/patterns';
import { TOKENS } from '@/src/lib/constants/tokens';
import { parseTokenAmount } from '@/src/lib/utils/token';
import { BigNumber } from 'ethers';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiChevronLeft } from 'react-icons/hi2';
import { useAccount, useBalance, useNetwork, Address as wAddress } from 'wagmi';

import { Button } from '../ui/Button';

type DepositAssetsData = {
  token: Token;
  pool: Pools;
  amount?: string;
};

type Token = (typeof Tokens)[number];
// All tokens (including native tokens)
const Tokens = ['Matic', 'SECOIN', 'DAI', 'Other'] as const;

export const DepositAssets = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<DepositAssetsData>({});
  // Context
  const { daoAddress, secoinAddress } = useDiamondSDKContext();
  const { isConnected, address } = useAccount();
  const { secoinBalance } = useSecoinBalance({ address });
  const { data: maticData } = useBalance({ address });
  const { chain } = useNetwork();

  // Creating 'tokens', the object displaying known tokens that can be deposited through this component,
  // using ERC20 contract writes or native token transaction.
  const secoin: TokenData | undefined = secoinAddress
    ? {
        address: secoinAddress as wAddress,
        isNativeToken: false,
        decimals: TOKENS.secoin.decimals,
      }
    : undefined;
  const tokens: Record<Token, TokenData | undefined> = {
    Matic: {
      address: '0x0000000000000000000000000000000000001010',
      isNativeToken: true,
      decimals: PREFERRED_NETWORK_METADATA.nativeCurrency.decimals,
    },
    SECOIN: secoin,
    DAI: {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      isNativeToken: false,
      decimals: 18,
    },
    Other: undefined,
  };

  // Adding watches + their derivatives
  const watchToken = useWatch({ control: control, name: 'token' });
  const token = tokens[watchToken];
  const isKnownToken = watchToken !== undefined && watchToken !== 'Other';

  const watchAmount = useWatch({ control: control, name: 'amount' });
  const amount = parseTokenAmount(watchAmount, token?.decimals);

  const pool = useWatch({ control, name: 'pool' });

  const { isLoading, error, isApproved, approve, depositAssets } =
    useDepositAssets({
      token,
      pool,
      amount: amount ?? undefined,
    });

  // State for loading symbol during transaction
  const [isSendingTransaction, setIsSendingTransaction] =
    useState<boolean>(false);

  // State for loading symbol during approval
  const [isSendingApproval, setIsSendingApproval] = useState<boolean>(false);

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
        message: 'You can not deposit this type of token',
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

    if (pool !== 'General' && watchToken !== 'SECOIN') {
      setError('root.deposit', {
        type: 'custom',
        message: `Only ${'SECOIN'} can be send to the ${pool} pool`,
      });
      return;
    }

    if (isLoading) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Loading',
      });
      return;
    }

    if (error !== null) {
      setError('root.deposit', {
        type: 'custom',
        message: error,
      });
      return;
    }

    const toasterConfig: ContractTransactionToast = {
      success: 'Deposit successful!',
      error: 'Deposit failed',
      onFinish: () => {
        setIsSendingTransaction(false);
        setValue('amount', '0');
      },
    };

    setIsSendingTransaction(true);
    toast.contractTransaction(() => depositAssets(), toasterConfig);
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
        <Header className="">Deposit</Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <Label
                  tooltip="Pool to send assets to. Pools other than 'general' can only receive SECOIN"
                  htmlFor="token"
                >
                  Pool
                </Label>
                <ErrorWrapper name="Pool" error={errors?.pool}>
                  <Controller
                    control={control}
                    name="pool"
                    rules={{ required: true }}
                    render={({ field: { onChange, name, value } }) => (
                      <Select
                        defaultValue={undefined}
                        value={value}
                        onValueChange={(v) => {
                          if (v !== 'General') {
                            setValue('token', 'SECOIN');
                          }
                          onChange(v);
                        }}
                        name={name}
                        disabled={isSendingTransaction}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pool" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Pools</SelectLabel>
                            {pools.map((pool) => (
                              <SelectItem key={pool} value={pool}>
                                {pool}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </ErrorWrapper>
              </div>
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
                        defaultValue={undefined}
                        value={value}
                        onValueChange={(v) => {
                          if (v !== 'SECOIN') {
                            setValue('pool', 'General');
                          }
                          onChange(v);
                        }}
                        name={name}
                        disabled={
                          isSendingTransaction ||
                          (pool !== undefined && pool !== 'General')
                        }
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
                  tooltip={`Amount of ${watchToken ?? 'token'} to deposit`}
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
                  {!isApproved && (
                    <Button
                      label="Approve"
                      type="button"
                      icon={isSendingApproval ? Loading : null}
                      disabled={isSendingApproval}
                      onClick={() => {
                        setIsSendingApproval(true);
                        toast.contractTransaction(() => approve(), {
                          success: 'Approved!',
                          error: 'Could not approve',
                          onFinish: () => setIsSendingApproval(false),
                        });
                      }}
                    />
                  )}
                  <ConditionalButton
                    label="Deposit"
                    disabled={
                      !isKnownToken || isSendingTransaction || !isApproved
                    }
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
                        when: isLoading,
                        content: <Loading className="w-5 h-5" />,
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
                          secoinBalance !== undefined &&
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
