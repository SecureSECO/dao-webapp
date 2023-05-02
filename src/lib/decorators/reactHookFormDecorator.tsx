/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action } from '@storybook/addon-actions';
import { StoryFn } from '@storybook/react';
import { ReactElement, ReactNode, FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const StorybookFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

export const withReactHookForm = (
  Story: FC,
  options: any
): ReturnType<StoryFn<ReactElement>> => (
  <StorybookFormProvider>
    <Story />
  </StorybookFormProvider>
);
