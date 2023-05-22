/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FC, ReactElement, ReactNode } from 'react';
import {
  ActionFormContext,
  ActionFormContextData,
} from '@/src/components/newProposal/steps/Actions';
import { StoryFn } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

const StorybookFormProvider: FC<{ children: ReactNode; options: any }> = ({
  children,
  options,
}) => {
  const { parameters } = options;
  const methods = useForm({ defaultValues: parameters.defaultValues });
  const actionContext: ActionFormContextData = {
    prefix: 'actions.0',
    index: 0,
    onRemove: () => {},
  };
  return (
    <FormProvider {...methods}>
      <ActionFormContext.Provider value={actionContext}>
        <form>{children}</form>
      </ActionFormContext.Provider>
    </FormProvider>
  );
};

export const withProposalAction = (
  Story: FC,
  options: any
): ReturnType<StoryFn<ReactElement>> => (
  <StorybookFormProvider options={options}>
    <Story />
  </StorybookFormProvider>
);
