/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { NumberPattern } from '@/src/lib/patterns';
import { parseEther } from 'ethers/lib/utils.js';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiInboxArrowDown } from 'react-icons/hi2';
import {
  useAccount,
  usePrepareSendTransaction,
  useProvider,
  useSendTransaction,
} from 'wagmi';

import { Address, AddressLength } from '../ui/Address';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import ConnectWalletWarning from '../ui/ConnectWalletWarning';
import { ErrorWrapper } from '../ui/ErrorWrapper';
import { LabelledInput } from '../ui/Input';
import { Label } from '../ui/Label';
import { MainCard } from '../ui/MainCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';

const Tokens = ['Matic', 'SECOIN', 'Other'] as const;
type Token = (typeof Tokens)[number];
type DepositAssetsData = {
  token: Token;
  amount?: string;
};

type SendData = Record<Token, string>;

const senders: SendData = {
  Matic: '',
  SECOIN: '',
  Other: undefined,
};

export const DepositAssets = ({}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositAssetsData>({});
  const { daoAddress } = useDiamondSDKContext();
  const { isConnected } = useAccount();
  const provider = useProvider();

  const watchToken = useWatch({ control: control, name: 'token' });
  const isKnownToken = watchToken !== undefined && watchToken !== 'Other';

  const onSubmit = (data: DepositAssetsData) => {
  
    //Can only send known tokens
    if (!isKnownToken || data.amount === undefined) return;
    const recipient = senders[data.token];
    //Should not happen
    if (recipient === undefined) return;

  const {data: sendData, isLoading, isSuccess, sendTransaction} = useSendTransaction({to: recipient
      value: parseEther(data.amount)
    });


    console.log(data);
  };

  return (
    <MainCard header="Deposit assets" variant="light" icon={HiInboxArrowDown}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
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
          {isKnownToken ? (
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
          ) : (
            <></>
          )}
          {watchToken === 'Other' ? (
            <div>
              <Label tooltip="Copy the ENS or address below and use your wallet's send feature to send money to your DAO's treasury.">
                Manual transfer
              </Label>
              <div className="flex flex-col md:flex-row gap-2">
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
                    address={'TODO: Add ENS'}
                  />
                </Card>
              </div>
            </div>
          ) : (
            <></>
          )}
          {isKnownToken ? (
            <div className="flex gap-x-2 flex-row">
              <Button label="Deposit assets" disabled={!isConnected} />
              {isConnected ? (
                <></>
              ) : (
                <ConnectWalletWarning action="to deposit" />
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </form>
    </MainCard>
  );
};
