/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { TextareaWYSIWYG } from '@/src/components/ui/TextareaWYSIWYG';
import { Textarea } from '@/src/components/ui/Textarea';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { StepOneMetadata } from './newProposalData';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';

export const StepOne = () => {
  const { setStep, setDataStep1, dataStep1 } = useNewProposalFormContext();

  const [resources, setResources] = useState<
    Array<{ name: string; link: string }>
  >([{ name: '', link: '' }]);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
  } = useForm<StepOneMetadata>({ defaultValues: dataStep1 });

  const onSubmit = (data: StepOneMetadata) => {
    // Handle submission
    console.log(data);
    setDataStep1(data);
    setStep(2);
  };

  const handleBack = () => {
    const data = getValues();
    setDataStep1(data);
  }

  const onError = (errors: any) => {
    //console.log(errors);
    console.log(getValues('title'));
    console.log('error');
  };

  const handleAddResource = () => {
    setResources([...resources, { name: '', link: '' }]);
  };

  const handleResourceChange = (
    index: number,
    key: 'name' | 'link',
    value: string
  ) => {
    const newResources = [...resources];
    newResources[index][key] = value;
    setResources(newResources);
  };

  const handleRemoveResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title of the proposal</Label>
          <ErrorWrapper name="Title" error={errors.title}>
            <Input
              {...register('title', { required: true })}
              type="text"
              placeholder="Title"
              id="title"
              className="..."
              aria-invalid={errors.title ? 'true' : 'false'}
              error={errors.title}
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="summary">Summary</Label>
          <ErrorWrapper name="Summary" error={errors.summary}>
            <Textarea
              {...register('summary', { required: true })}
              placeholder="Summary"
              id="summary"
              className="..."
              error={errors.summary}
            />
          </ErrorWrapper>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="body">Body</Label>
          <ErrorWrapper name="Description" error={errors.description}>
            <Controller
              control={control}
              name="description" // Replace this with the name of the field you want to store the WYSIWYG content
              rules={{ required: true }} // Add any validation rules you need
              defaultValue=""
              render={({ field }) => (
                <TextareaWYSIWYG<StepOneMetadata>
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={() => field.onBlur()}
                  name={field.name}
                  placeholder="Enter your content"
                  error={errors.description}
                  setError={() =>
                    setError('description', {
                      type: 'required',
                      message: 'Description is required',
                    })
                  }
                  clearErrors={() => clearErrors('description')}
                />
              )}
            />
          </ErrorWrapper>
        </div>
        <fieldset className="flex flex-col gap-2">
          <Label htmlFor="recources">Links and resources</Label>
          {resources.map((resource, index) => (
            <ResourceInput
              key={index}
              resource={resource}
              onChange={(key, value) => handleResourceChange(index, key, value)}
              onRemove={() => handleRemoveResource(index)}
              register={register}
              prefix={`resources[${index}]`}
            />
          ))}
          <Button
            onClick={handleAddResource}
            type="button"
            variant={'outline'}
            className="w-fit"
            icon={HiPlus}
          >
            Add resource
          </Button>
        </fieldset>
      </div>
      <StepNavigator onBack={handleBack} />
    </form>
  );
};

const ResourceInput = ({
  resource,
  onChange,
  onRemove,
  register,
  prefix,
}: {
  resource: { name: string; link: string };
  onChange: (key: 'name' | 'link', value: string) => void;
  onRemove: () => void;
  register: any;
  prefix: string;
}) => {
  return (
    <div className="flex w-full items-center gap-2">
      <Input
        {...register(`${prefix}.name`)}
        type="text"
        value={resource.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Resource name"
        className="..."
      />
      <Input
        {...register(`${prefix}.link`, {
          pattern: {
            value: /^(https?:\/\/)?[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/,
            message: 'Invalid URL',
          },
        })}
        type="text"
        value={resource.link}
        onChange={(e) => onChange('link', e.target.value)}
        placeholder="Resource link"
        className="..."
      />
      <div className="shrink-0">
        <HiXMark className="h-5 w-5 cursor-pointer" onClick={onRemove} />
      </div>
    </div>
  );
};
