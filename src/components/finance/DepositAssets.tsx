/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NumberPattern } from '@/src/lib/patterns';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { HiInboxArrowDown } from 'react-icons/hi2';

import { Address, AddressLength } from '../ui/Address';
import { Button } from '../ui/Button';
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
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';

const Tokens = ['Matic', 'SECOIN', 'Other'] as const;
type Token = (typeof Tokens)[number];
type DepositAssetsData = {
  token: Token;
  amount?: string;
};

export const DepositAssets = ({}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositAssetsData>({});
  const { daoAddress } = useDiamondSDKContext();

  const watchToken = useWatch({ control: control, name: 'token' });
  const isKnownToken = watchToken !== undefined && watchToken !== 'Other';

  const onSubmit = (data: DepositAssetsData) => {
    console.log(data);
  };

  return (
    <MainCard header="Deposit assets" variant="light" icon={HiInboxArrowDown}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label tooltip="Asset to deposit" htmlFor="token">
          Plugin
        </Label>
        <ErrorWrapper name="token" error={errors?.token}>
          <Controller
            control={control}
            name="token"
            rules={{ required: true }}
            render={({ field: { onChange, name, value } }) => (
              <Select defaultValue={value} onValueChange={onChange} name={name}>
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
            label="Token Amount"
            error={errors.amount}
          />
        ) : (
          <></>
        )}
        {watchToken === 'Other' ? (
          <div>
            Copy the <span className="underline">ENS</span> or{' '}
            <span className="underline">address</span> below and use your
            wallet&apos;s send feature to send money to your DAO&apos;s
            treasury.
            <Address
              showCopy={true}
              hasLink={true}
              maxLength={AddressLength.Medium}
              address={daoAddress ?? ''}
            />
            <Address
              showCopy={true}
              hasLink={false}
              maxLength={AddressLength.Full}
              address={'TODO: Add ENS'}
            />
          </div>
        ) : (
          <></>
        )}
        <Button label="Deposit assets" />
      </form>
    </MainCard>
  );
};
