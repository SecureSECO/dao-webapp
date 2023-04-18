/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AddressPattern, NumberPattern } from '@/src/lib/patterns';
import { Input } from '../../ui/Input';
import { HiCircleStack, HiPlus, HiXMark } from 'react-icons/hi2';
import { Button } from '../../ui/Button';
import { Control, UseFormRegister, useFieldArray } from 'react-hook-form';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { MainCard } from '../../ui/MainCard';
import { ActionFormError, ProposalFormActions } from '../steps/Actions';
import { Label } from '@/src/components/ui/Label';

export type ProposalFormMint = {
  name: 'mint_tokens';
  inputs: {
    mintTokensToWallets: {
      address: string;
      amount: string | number;
    }[];
  };
  summary: {
    newTokens: number;
    tokenSupply: number;
    newHoldersCount: number;
    daoTokenSymbol: string;
    daoTokenAddress: string;
    totalMembers?: number;
  };
};

export const emptyMintAction: ProposalFormMint = {
  name: 'mint_tokens',
  inputs: {
    mintTokensToWallets: [{ address: '', amount: 0 }],
  },
  summary: {
    newTokens: 0,
    tokenSupply: 0,
    newHoldersCount: 0,
    daoTokenSymbol: '',
    daoTokenAddress: '',
  },
};

export type ProposalFormMintData = {
  name: 'mint_tokens';
  wallets: ProposalFormMintWallet[];
};

export type ProposalFormMintWallet = {
  address: string;
  amount: number;
};

export const emptyMintWallet: ProposalFormMintWallet = {
  address: '',
  amount: 0,
};

export const emptyMintData: ProposalFormMintData = {
  name: 'mint_tokens',
  wallets: [emptyMintWallet],
};

/**
 * @returns Component to be used within a form to describe the action of minting tokens.
 */
export const MintTokensInput = ({
  register,
  control,
  prefix,
  errors,
  onRemove,
}: {
  register: UseFormRegister<ProposalFormActions>;
  control: Control<ProposalFormActions>;
  prefix: `actions.${number}`;
  errors: ActionFormError<ProposalFormMintData>;
  onRemove: () => void;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: `${prefix}.wallets`,
    control: control,
  });

  return (
    <MainCard
      header="Mint tokens"
      variant="light"
      icon={HiCircleStack}
      aside={
        <Button
          type="button"
          icon={HiXMark}
          onClick={onRemove}
          variant="ghost"
        />
      }
    >
      <div className="grid grid-cols-2 justify-start gap-2 ">
        <Label tooltip="Address of the wallet to receive the tokens">
          Address
        </Label>
        <Label tooltip="Amount of tokens to mint">Amount</Label>
        {/* List of wallets mint tokens to */}
        {fields.map((field, index) => (
          <MintListItem
            key={field.id}
            prefix={`${prefix}.wallets.${index}`}
            register={register}
            errors={errors?.wallets?.[index] ?? undefined}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
      <Button
        variant="subtle"
        type="button"
        label="Add wallet"
        icon={HiPlus}
        onClick={() => append({ address: '', amount: 0 })}
      />
    </MainCard>
  );
};

/**
 * @returns Two elements to be used within a form to describe the action of minting tokens to one specific wallet
 */
const MintListItem = ({
  register,
  onRemove,
  errors,
  prefix,
}: {
  register: any;
  onRemove: () => void;
  errors: ActionFormError<ProposalFormMintWallet>;
  prefix: `actions.${number}.wallets.${number}`;
}) => (
  <>
    <ErrorWrapper name="Address" error={errors?.address ?? undefined}>
      <Input
        {...register(`${prefix}.address`, { required: true })}
        type="text"
        id="address"
        error={errors?.address ?? undefined}
        title="An address starting with 0x, followed by 40 address characters"
        pattern={AddressPattern}
        className="w-full basis-2/5"
        placeholder="0x..."
      />
    </ErrorWrapper>
    <div className="flex w-full flex-row gap-2">
      <ErrorWrapper name="Amount" error={errors?.amount ?? undefined}>
        <Input
          {...register(`${prefix}.amount`, { required: true })}
          type="number"
          id="tokens"
          error={errors?.amount ?? undefined}
          title="A number using a '.' as decimal place, e.g. '3.141'"
          pattern={NumberPattern}
          className="w-full basis-2/3"
          min="0"
          required
        />
      </ErrorWrapper>
      <HiXMark
        className="h-5 w-5 cursor-pointer self-center"
        onClick={onRemove}
      />
    </div>
  </>
);
