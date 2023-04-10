/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ProposalActionList } from './actions/ProposalActionList';
import { AddActionButton } from './actions/ui/AddActionButton';
import { AddActionCard } from './actions/ui/AddActionCard';
import { StepThreeData } from './newProposalData';
import { StepNavigator, useNewProposalFormContext } from '@/src/pages/NewProposal';

export const StepThree = () => {
  const { setStep, setDataStep3 } = useNewProposalFormContext();

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
            <ProposalActionList
              fields={fields}
              register={register}
              control={control}
              getValues={getValues}
              setValue={setValue}
              errors={errors}
              remover={remove}
            />
            <AddActionButton append={append} />
          </>
        )}
      </div>
      <StepNavigator />
    </form>
  );
};