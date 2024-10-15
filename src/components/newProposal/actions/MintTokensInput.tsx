/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from 'react';
import {
  ActionFormContext,
  ActionFormError,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import { Button } from '@/src/components/ui/Button';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import { AddressPattern, NumberPattern } from '@/src/lib/constants/patterns';
import { someUntil } from '@/src/lib/utils';
import {
  useFieldArray,
  useFormContext,
  UseFormGetValues,
} from 'react-hook-form';
import { HiCircleStack, HiPlus, HiXMark } from 'react-icons/hi2';

export interface ProposalFormMintData {
  name: 'mint_tokens';
  wallets: ProposalFormMintWallet[];
}

export type ProposalFormMintWallet = {
  address: string;
  amount: string;
};

export const emptyMintWallet: ProposalFormMintWallet = {
  address: '',
  amount: '0',
};

export const emptyMintData: ProposalFormMintData = {
  name: 'mint_tokens',
  wallets: [emptyMintWallet],
};

/**
 * @returns Component to be used within a form to describe the action of minting tokens.
 */
export const MintTokensInput = () => {
  const {
    register,
    formState: { errors: formErrors },
    control,
    getValues,
  } = useFormContext<ProposalFormActions>();

  const { prefix, index, onRemove } = useContext(ActionFormContext);

  const errors: ActionFormError<ProposalFormMintData> = formErrors.actions
    ? formErrors.actions[index]
    : undefined;

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
      <div>
        {/* List of wallets mint tokens to */}
        {fields.map((field, index) => (
          <MintListItem
            key={field.id}
            walletsPrefix={`${prefix}.wallets`}
            index={index}
            register={register}
            errors={errors?.wallets?.[index]}
            onRemove={() => remove(index)}
            getValues={getValues}
          />
        ))}
      </div>
      <Button
        variant="subtle"
        type="button"
        label="Add wallet"
        icon={HiPlus}
        onClick={() => append({ address: '', amount: '0' })}
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
  walletsPrefix,
  index,
  getValues,
}: {
  register: any;
  onRemove: () => void;
  errors: ActionFormError<ProposalFormMintWallet>;
  walletsPrefix: `actions.${number}.wallets`;
  index: number;
  getValues: UseFormGetValues<ProposalFormActions>;
}) => {
  const prefix = `${walletsPrefix}.${index}`;
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1">
      <div>
        <ErrorWrapper name="Address" error={errors?.address}>
          <Label
            tooltip="Address of the wallet to receive the tokens"
            htmlFor="address"
          >
            Address
          </Label>
          <Input
            {...register(`${prefix}.address`, {
              required: true,
              pattern: {
                value: AddressPattern,
                message:
                  'Please enter an address starting with 0x, followed by 40 address characters',
              },
              // Custom validation function to prevent duplicate addresses
              validate: (value: string) => {
                let anyDuplicates = someUntil(
                  getValues(walletsPrefix),
                  (a) => a.address === value,
                  index
                );
                return !anyDuplicates || 'Duplicate address';
              },
            })}
            type="text"
            id="address"
            error={errors?.address}
            className="w-full basis-2/5"
            placeholder="0x..."
          />
        </ErrorWrapper>
      </div>
      <div className="flex w-full flex-row items-end gap-2">
        <ErrorWrapper name="Amount" error={errors?.amount}>
          <Label
            tooltip="Amount of tokens to mint"
            className="sr-only sm:not-sr-only"
            htmlFor="tokens"
          >
            Amount
          </Label>
          <Input
            {...register(`${prefix}.amount`, {
              required: true,
              pattern: {
                value: NumberPattern,
                message: 'Please enter a number, e.g. 3.141',
              },
              valueAsNumber: false,
            })}
            id="tokens"
            error={errors?.amount}
            className="w-full basis-2/3"
            min="0"
            step="0.001"
            type="number"
            required
          />
        </ErrorWrapper>
        <Button
          variant="ghost"
          icon={HiXMark}
          className="mb-1 p-0 w-8 h-8"
          onClick={onRemove}
        />
      </div>
    </div>
  );
};
