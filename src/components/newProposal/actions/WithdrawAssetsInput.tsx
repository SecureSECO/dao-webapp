/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { HiBanknotes, HiXMark } from 'react-icons/hi2';
import { Button } from '@/src/components/ui/Button';
import { AddressPattern, NumberPattern } from '@/src/lib/patterns';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { MainCard } from '@/src/components/ui/MainCard';
import {
  ActionFormError,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select';
import { useDaoBalance } from '@/src/hooks/useDaoBalance';
import { anyNullOrUndefined } from '@/src/lib/utils';
import TokenAmount from '@/src/components/ui/TokenAmount';

export type ProposalFormWithdrawData = {
  name: 'withdraw_assets';
  recipient: string;
  tokenAddress: string;
  amount: string;
};

export type ProposalFormWithdraw = {
  amount: number;
  name: 'withdraw_assets';
  to: string;
  tokenAddress: string;
  tokenBalance: number;
  tokenDecimals: number;
  tokenImgUrl: string;
  tokenName: string;
  tokenSymbol: string;
  isCustomToken: boolean;
};

export const emptyWithdrawData: ProposalFormWithdrawData = {
  name: 'withdraw_assets',
  recipient: '',
  tokenAddress: '',
  amount: '',
};

export const emptyWithdraw: ProposalFormWithdraw = {
  amount: 0,
  name: 'withdraw_assets',
  to: '',
  tokenAddress: '',
  tokenBalance: 0,
  tokenDecimals: 0,
  tokenImgUrl: '',
  tokenName: '',
  tokenSymbol: '',
  isCustomToken: true,
};

/**
 * @returns Component to be used within a form to describe the action of withdrawing assets.
 */
export const WithdrawAssetsInput = ({
  register,
  prefix,
  errors,
  onRemove,
  control,
}: {
  register: UseFormRegister<ProposalFormActions>;
  prefix: `actions.${number}`;
  errors: ActionFormError<ProposalFormWithdrawData>;
  onRemove: any;
  control: Control<ProposalFormActions, any>;
}) => {
  // if (daoBalanceData.error) return <span> {daoBalanceData.error} </span>;
  const { daoBalances, error, loading } = useDaoBalance({});
  const filteredDaoBalances =
    error || loading
      ? []
      : daoBalances.filter(
          (token) =>
            !anyNullOrUndefined(
              token.name,
              token.symbol,
              token.address,
              token.balance
            )
        );

  return (
    <MainCard
      className="flex flex-col gap-4"
      header="Withdraw Assets"
      icon={HiBanknotes}
      variant="light"
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      <div className="flex flex-col gap-y-1">
        <Label
          htmlFor="recipient"
          tooltip="Address of the wallet to receive the assets"
        >
          Recipient
        </Label>
        <ErrorWrapper name="Recipient" error={errors?.recipient ?? undefined}>
          <Input
            {...register(`${prefix}.recipient`, { required: true })}
            type="text"
            id="recipient"
            pattern={AddressPattern}
            title="An address starting with 0x, followed by 40 address characters"
            error={errors?.recipient ?? undefined}
            placeholder="0x..."
          />
        </ErrorWrapper>
      </div>
      <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1 ">
          <Label tooltip="Token to withdraw" htmlFor="tokenAddress">
            Token
          </Label>
          {/* To be replaced with <Select> component, which is currently, conveniently located in another branch */}
          <ErrorWrapper name="Token" error={errors?.tokenAddress ?? undefined}>
            <Controller
              control={control}
              name={`${prefix}.tokenAddress`}
              render={({ field: { onChange, name, value } }) => (
                <Select
                  defaultValue={value}
                  onValueChange={onChange}
                  name={name}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Token</SelectLabel>
                      {filteredDaoBalances.map((token, i) => (
                        <SelectItem key={i} value={token.address ?? ''}>
                          <div className="flex flex-row items-center gap-x-1">
                            <p>
                              {!token.name || token.name === ''
                                ? 'Unknown'
                                : token.name}{' '}
                              -{' '}
                            </p>
                            <TokenAmount
                              amount={token.balance}
                              tokenDecimals={token.decimals}
                              symbol={token.symbol}
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/* <Input
              {...register(`${prefix}.tokenAddress`, { required: true })}
              name="tokenAddress"
              pattern={AddressPattern}
              title="An address starting with 0x, followed by 40 address characters"
              error={errors?.tokenAddress ?? undefined}
            /> */}
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label tooltip="Amount of tokens to withdraw" htmlFor="amount">
            Amount
          </Label>
          <ErrorWrapper name="Amount" error={errors?.amount ?? undefined}>
            <Input
              {...register(`${prefix}.amount`, { required: true })}
              type="number"
              id="amount"
              title="A number using a '.' as decimal place, e.g. '3.141'"
              pattern={NumberPattern}
              placeholder="0"
              error={errors?.amount ?? undefined}
            />
          </ErrorWrapper>
        </div>
      </div>
    </MainCard>
  );
};
