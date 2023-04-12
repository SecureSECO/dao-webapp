/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { AddActionButton } from './actions/ui/AddActionButton';
import { AddActionCard } from './actions/ui/AddActionCard';
import { ActionFormData, StepThreeData } from './newProposalData';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { WithdrawAssetsAction } from '@/src/components/newProposal/actions/WithdrawAssetsAction';
import { MintTokensAction } from '@/src/components/newProposal/actions/MintTokensAction';

export const StepThree = () => {
  const { setStep, dataStep3, setDataStep3 } = useNewProposalFormContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    control,
  } = useForm<StepThreeData>();

  const { fields, append, remove } = useFieldArray<StepThreeData>({
    name: 'actions',
    control: control,
  });

  const onSubmit = (data: StepThreeData) => {
    console.log(data);
    setDataStep3(data);
    setStep(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <span>If option yes wins</span>
        {fields.length === 0 ? (
          <AddActionCard append={append} />
        ) : (
          <>
            {/* List op proposal actions */}
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
            <AddActionButton append={append} />
          </>
        )}
      </div>
      <StepNavigator />
    </form>
  );
};
