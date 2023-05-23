/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { NumberPattern } from '@/src/lib/constants/patterns';
import { parseTokenAmount } from '@/src/lib/utils/token';
import { BigNumber } from 'ethers';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiChevronLeft } from 'react-icons/hi2';
import {
  erc20ABI,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import Loading from '../icons/Loading';
import { Address, AddressLength } from '../ui/Address';
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

type Token = (typeof Tokens)[number];
type DepositAssetsData = {
  token: Token;
  amount?: string;
};
type AddressString = `0x${string}`;
type SendData = Record<Token, AddressString | undefined>;

const Tokens = ['Matic', 'SECOIN', 'Other'] as const;
const tokenAddresses: SendData = {
  Matic: '0x0000000000000000000000000000000000001010',
  SECOIN: '0x...',
  Other: undefined,
};

export const DepositAssets = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<DepositAssetsData>({});
  const { daoAddress } = useDiamondSDKContext();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const watchToken = useWatch({ control: control, name: 'token' });
  const tokenAddress = tokenAddresses[watchToken];
  const isKnownToken = watchToken !== undefined && watchToken !== 'Other';

  const watchAmount = useWatch({ control: control, name: 'amount' });
  const amount = parseTokenAmount(watchAmount, 18);

  const debouncedTokenId = useDebounce(amount, 500);

  const { config, error } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [daoAddress as AddressString, amount as BigNumber],
    enabled: Boolean(debouncedTokenId),
  });

  const { data: writeData, writeAsync } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: writeData?.hash,
  });

  const onSubmit = (data: DepositAssetsData) => {
    //Can only send known tokens
    if (!isKnownToken || data.amount === undefined) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Error: can only deposit known token types',
      });
      return;
    }
    //Should not happen
    if (tokenAddress === undefined) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Error: can not deposit this type of token',
      });
      return;
    }

    if (daoAddress === undefined) {
      setError('root.deposit', {
        type: 'custom',
        message: "Error: can not determine DAO's address",
      });
      return;
    }

    if (!BigNumber.isBigNumber(amount)) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Error: the amount is not in the correct format',
      });
      return;
    }

    if (error !== null) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Error: can not create transaction',
      });
      console.log(error);
      console.log(config);
      return;
    }

    if (!writeAsync) {
      setError('root.deposit', {
        type: 'custom',
        message: 'Error: can not create transaction',
      });
      return;
    }

    writeAsync();

    console.log(data);
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
        <Header className="">Depost assets</Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col">
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
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Token" />
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
              {isKnownToken && (
                <div>
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
                  />
                </div>
              )}
            </div>
            {watchToken === 'Other' && (
              <div>
                <p className="">
                  Copy the address or ENS below and use your wallet&apos;s send
                  feature to send money to the DAO&apos;s treasury.
                </p>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Card variant="outline">
                    <Address
                      showCopy={true}
                      hasLink={true}
                      maxLength={AddressLength.Medium}
                      address={daoAddress ?? ''}
                    />
                  </Card>
                  <Card variant="outline">
                    <Address
                      showCopy={true}
                      hasLink={false}
                      maxLength={AddressLength.Full}
                      address={'ENS not yet supported'}
                    />
                  </Card>
                </div>
              </div>
            )}
            {isKnownToken && (
              <ErrorWrapper name="deposit" error={errors?.root?.deposit as any}>
                <div className="flex flex-row gap-x-2">
                  <ConditionalButton
                    label="Deposit assets"
                    icon={isLoading ? Loading : null}
                    disabled={isLoading}
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
