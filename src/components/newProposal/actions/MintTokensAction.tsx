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
import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from 'react-hook-form';
import {
  ActionMintTokenFormData,
  MintAddressAmount,
  StepThreeData,
} from '../newProposalData';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import { MainCard } from '../../ui/MainCard';
import { ActionFormError } from '../StepThreeActions';

/**
 * @returns Component to be used within a form to describe the action of minting tokens.
 */
export const MintTokensAction = ({
  register,
  control,
  prefix,
  errors,
  onRemove,
}: {
  register: UseFormRegister<StepThreeData>;
  control: Control<StepThreeData>;
  prefix: `actions.${number}`;
  errors: ActionFormError<ActionMintTokenFormData>;
  onRemove: () => void;
}) => {
  const { fields, append, remove } = useFieldArray({
    name: `${prefix}.wallets`,
    control: control,
  });

  return (
    <MainCard
      className="flex flex-col gap-4"
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
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <div className="flex w-full flex-row">
          <span className="basis-2/5 pl-2">Address</span>
          <span className="basis-2/5 pl-2">Tokens</span>
        </div>
        {fields.map((field, index) => (
          <AddressTokensMint
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

const AddressTokensMint = ({
  register,
  onRemove,
  errors,
  prefix,
}: {
  register: any;
  onRemove: () => void;
  errors: ActionFormError<MintAddressAmount>;
  prefix: `actions.${number}.wallets.${number}`;
}) => (
  <div className="flex w-full flex-col items-center gap-2 sm:flex-row">
    <ErrorWrapper name="Address" error={errors?.address ?? undefined}>
      <Input
        {...register(`${prefix}.address`, { required: true })}
        type="text"
        id="address"
        error={errors?.address ?? undefined}
        title="An address starting with 0x, followed by 40 address characters"
        pattern={AddressPattern}
        className="w-full basis-2/5"
      />
    </ErrorWrapper>
    <div className="flex w-full flex-row items-center gap-2">
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
  </div>
);
