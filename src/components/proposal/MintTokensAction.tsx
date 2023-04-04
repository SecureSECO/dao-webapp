import {
  Action,
  ActionMintToken,
  ActionMintTokenFormData,
  EmptyActionMintToken,
} from '@/src/lib/Actions';
import { AddressPattern, NumberPattern } from '@/src/lib/Patterns';
import { Input } from '../ui/Input';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { FieldErrors, useFieldArray } from 'react-hook-form';
import { StepThreeData } from '@/src/pages/NewProposal';

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

  // const handleRemove = (index: number) => {
  // const newMintTokens = _action.inputs.mintTokensToWallets.slice(0);
  // newMintTokens.splice(index, 1);
  // setAction({ ..._action, inputs: { mintTokensToWallets: newMintTokens } });
  // };

  return (
    <Card className="grid grid-cols-3 gap-4">
      <span className="col-span-1 pl-2">Address</span>
      <span className="col-span-1 pl-2">Tokens</span>
      <span className="col-span-1" />
      {/* TODO: Fix removal of elements */}
      {fields.map((field, index) => (
        <AddressTokensMint
          key={field.id}
          unique_prefix={`${prefix}.${field.id}`}
          register={register}
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

type AddressToken = {
  address: string;
  amount: string | number;
};

const AddressTokensMint = ({
  register,
  onRemove,
  unique_prefix,
}: {
  register: any;
  onRemove: () => void;
  unique_prefix: string;
}) => (
  <div className="col-span-3 grid grid-cols-3 gap-4">
    <div className="flex flex-col gap-2">
      {/* <Label htmlFor="address">Address</Label> */}
      {/* TODO Add pattern for validation */}
      <Input
        {...register(`${unique_prefix}.address`)}
        type="text"
        id="address"
        pattern={AddressPattern}
      />
    </div>
    <div className="flex flex-col gap-2">
      {/* <Label htmlFor="tokens">Tokens</Label> */}
      <Input
        {...register(`${unique_prefix}.amount`)}
        type="number"
        id="tokens"
        pattern={NumberPattern}
      />
    </div>
    <HiXMark
      className="h-5 w-5 cursor-pointer self-center"
      onClick={onRemove}
    />
  </div>
);
