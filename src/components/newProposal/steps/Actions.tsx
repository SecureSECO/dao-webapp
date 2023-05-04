/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  useForm,
  useFieldArray,
  FieldError,
  FieldErrors,
  FieldValues,
  Merge,
} from 'react-hook-form';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import {
  ProposalFormWithdrawData,
  WithdrawAssetsInput,
  emptyWithdrawData,
} from '@/src/components/newProposal/actions/WithdrawAssetsInput';
import {
  MintTokensInput,
  ProposalFormMintData,
  emptyMintData,
} from '@/src/components/newProposal/actions/MintTokensInput';
import {
  MergePRInput,
  ProposalFormMergeData,
  emptyMergeData,
} from '@/src/components/newProposal/actions/MergePRInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import { HiBanknotes, HiCircleStack, HiCog, HiPlus } from 'react-icons/hi2';
import { Label } from '@/src/components/ui/Label';
import { FaGithub } from 'react-icons/fa';
import {
  ChangeParametersInput,
  emptyChangeParameter,
  ProposalFormChangeParameter,
} from '../actions/ChangeParametersInput';

export interface ProposalFormActions {
  actions: ProposalFormAction[];
}

export type ProposalFormAction =
  | ProposalFormWithdrawData
  | ProposalFormMintData
  | ProposalFormMergeData
  | ProposalFormChangeParameter;

export const Actions = () => {
  const { setStep, dataStep3, setDataStep3 } = useNewProposalFormContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm<ProposalFormActions>({ defaultValues: dataStep3 });

  const { fields, append, remove } = useFieldArray<ProposalFormActions>({
    name: 'actions',
    control: control,
  });

  const onSubmit = (data: ProposalFormActions) => {
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
      <div className="space-y-2">
        <div className="flex flex-col gap-y-1">
          <Label tooltip="These actions can be executed after a vote successfully passes">
            Actions
          </Label>
          {fields.length === 0 ? (
            <p className="italic text-highlight-foreground/80">No actions</p>
          ) : (
            <>
              {/* List of proposal actions */}
              <div className="flex flex-col gap-6">
                {fields.map((field: Record<'id', string>, index: number) => {
                  const prefix: `actions.${number}` = `actions.${index}`;
                  const action: ProposalFormAction = getValues(prefix);

                  switch (action.name) {
                    case 'withdraw_assets':
                      return (
                        <WithdrawAssetsInput
                          register={register}
                          prefix={prefix}
                          key={field.id}
                          errors={
                            errors.actions ? errors.actions[index] : undefined
                          }
                          onRemove={() => remove(index)}
                          control={control}
                        />
                      );
                    case 'mint_tokens':
                      return (
                        <MintTokensInput
                          register={register}
                          control={control}
                          prefix={prefix}
                          key={field.id}
                          errors={
                            errors.actions ? errors.actions[index] : undefined
                          }
                          onRemove={() => remove(index)}
                          getValues={getValues}
                        />
                      );
                    case 'merge_pr':
                      return (
                        <MergePRInput
                          register={register}
                          prefix={prefix}
                          key={field.id}
                          errors={
                            errors.actions ? errors.actions[index] : undefined
                          }
                          onRemove={() => remove(index)}
                        />
                      );
                    case 'change_parameter':
                      return (
                        <ChangeParametersInput
                          control={control}
                          register={register}
                          errors={errors?.actions?.[index]}
                          prefix={prefix}
                          onRemove={() => remove(index)}
                        />
                      );
                  }
                })}
              </div>
            </>
          )}
        </div>
        <AddActionButton append={append} actions={getValues()} />
      </div>
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
  actions,
}: {
  // eslint-disable-next-line no-unused-vars
  append: (fn: ProposalFormAction) => void;
  actions: ProposalFormActions;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" icon={HiPlus} label="Add action" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => append(emptyWithdrawData)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiBanknotes className="h-5 w-5 shrink-0" />
            <span>Withdraw assets</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => append(emptyMintData)}
            className="gap-x-2 hover:cursor-pointer"
            disabled={
              actions?.actions?.some((x) => x.name == 'mint_tokens') ?? false
            }
          >
            <HiCircleStack className="h-5 w-5 shrink-0" />
            <span>Mint tokens</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => append(emptyMergeData)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <FaGithub className="h-5 w-5 shrink-0" />
            <span>Merge pull request</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => append(emptyChangeParameter)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiCog className="h-5 w-5 shrink-0" />
            <span>Change plugin parameter</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
