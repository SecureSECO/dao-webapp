import {
  Action,
  ActionMintToken,
  ActionMintTokenFormData,
  EmptyActionMintToken,
  MintAddressAmount,
} from '@/src/lib/Actions';
import { AddressPattern, NumberPattern } from '@/src/lib/Patterns';
import { Input } from '../ui/Input';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { FieldErrors, useFieldArray } from 'react-hook-form';
import { StepThreeData } from '@/src/pages/NewProposal';
import { ErrorWrapper } from '../ui/ErrorWrapper';

export const MintTokensAction = ({
  register,
  control,
  prefix,
  errors,
}: {
  register: any;
  control: any;
  prefix: string;
  errors: FieldErrors<ActionMintTokenFormData> | undefined;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: `${prefix}.mintFields`,
    control: control,
  });

  useEffect(() => append({ address: '', amount: '' }), []);

  return (
    <Card className="grid grid-cols-3 gap-4">
      <span className="col-span-1 pl-2">Address</span>
      <span className="col-span-1 pl-2">Tokens</span>
      <span className="col-span-1" />
      {fields.map((field, index) => (
        <AddressTokensMint
          key={field.id}
          unique_prefix={`${prefix}.${field.id}`}
          register={register}
          errors={errors?.wallets?.[index] ?? undefined}
          onRemove={() => remove(index)}
        />
      ))}
      <Button
        variant="subtle"
        type="button"
        label="Add wallet"
        icon={HiPlus}
        onClick={() => append({ address: '', amount: '' })}
      />
    </Card>
  );
};

const AddressTokensMint = ({
  register,
  onRemove,
  errors,
  unique_prefix,
}: {
  register: any;
  onRemove: () => void;
  errors: FieldErrors<MintAddressAmount> | undefined;
  unique_prefix: string;
}) => (
  <div className="col-span-3 grid grid-cols-3 gap-4">
    <div className="flex flex-col gap-2">
      <ErrorWrapper name="Address" error={errors?.address ?? undefined}>
        <Input
          {...register(`${unique_prefix}.address`)}
          type="text"
          id="address"
          error={errors?.address ?? undefined}
          pattern={AddressPattern}
        />
      </ErrorWrapper>
    </div>
    <div className="flex flex-col gap-2">
      <ErrorWrapper name="Amount" error={errors?.amount ?? undefined}>
        <Input
          {...register(`${unique_prefix}.amount`)}
          type="number"
          id="tokens"
          error={errors?.amount ?? undefined}
          pattern={NumberPattern}
        />
      </ErrorWrapper>
    </div>
    <HiXMark
      className="h-5 w-5 cursor-pointer self-center"
      onClick={onRemove}
    />
  </div>
);
