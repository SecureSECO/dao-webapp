/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {
  useForm,
  useFieldArray,
  FieldError,
  FieldErrors,
  FieldValues,
  Merge,
} from 'react-hook-form';
import {
  ActionFormData,
  StepThreeData,
  emptyMintTokenForm as emptyMintTokensForm,
  emptyWithdrawForm,
} from './newProposalData';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { WithdrawAssetsAction } from '@/src/components/newProposal/actions/WithdrawAssetsAction';
import { MintTokensAction } from '@/src/components/newProposal/actions/MintTokensAction';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import { HiBanknotes, HiCircleStack, HiPlus } from 'react-icons/hi2';

export const StepThree = () => {
  const { setStep, dataStep3, setDataStep3 } = useNewProposalFormContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    control,
  } = useForm<StepThreeData>({ defaultValues: dataStep3 });

  const { fields, append, remove } = useFieldArray<StepThreeData>({
    name: 'actions',
    control: control,
  });

  const onSubmit = (data: StepThreeData) => {
    console.log(data);
    setDataStep3(data);
    setStep(4);
  };

  const handleBack = () => {
    const data = getValues();
    setDataStep3(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <p>Actions</p>
        {fields.length === 0 ? (
          <p className="italic text-slate-500 dark:text-slate-400">
            No actions
          </p>
        ) : (
          <>
            {/* List of proposal actions */}
            <div className="flex flex-col gap-6">
              {fields.map((field: Record<'id', string>, index: number) => {
                const prefix: `actions.${number}` = `actions.${index}`;
                const action: ActionFormData = getValues(prefix);

                switch (action.name) {
                  case 'withdraw_assets':
                    return (
                      <WithdrawAssetsAction
                        register={register}
                        prefix={prefix}
                        key={field.id}
                        setValue={setValue}
                        errors={
                          errors.actions ? errors.actions[index] : undefined
                        }
                        onRemove={() => remove(index)}
                      />
                    );
                  case 'mint_tokens':
                    return (
                      <MintTokensAction
                        register={register}
                        control={control}
                        prefix={prefix}
                        key={field.id}
                        errors={
                          errors.actions ? errors.actions[index] : undefined
                        }
                        onRemove={() => remove(index)}
                      />
                    );
                }
              })}
            </div>
          </>
        )}
      </div>
      <AddActionButton append={append} />
      <StepNavigator onBack={handleBack} />
    </form>
  );
};

export type ActionFormError<T extends FieldValues> =
  | Merge<FieldError, FieldErrors<NonNullable<T> | T>>
  | undefined;

/**
 * @param append function that is called with ActionFormData to be appended to some parent-like component.
 * @returns A dropdown component to add proposal action input cards
 */
export const AddActionButton = ({
  append,
}: {
  // eslint-disable-next-line no-unused-vars
  append: (fn: ActionFormData) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" icon={HiPlus} label="Add action" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => append(emptyWithdrawForm)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiBanknotes className="h-5 w-5 shrink-0" />
            <span>Withdraw assets</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => append(emptyMintTokensForm)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiCircleStack className="h-5 w-5 shrink-0" />
            <span>Mint tokens</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
