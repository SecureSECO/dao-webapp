/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import {
  useForm,
  Controller,
  FieldErrors,
  UseFormGetValues,
  useFieldArray,
} from 'react-hook-form';
import { Button } from '@/src/components/ui/Button';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { TextareaWYSIWYG } from '@/src/components/ui/TextareaWYSIWYG';
import { Textarea } from '@/src/components/ui/Textarea';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { ProposalResource } from '@/src/hooks/useProposal';
import { UrlPattern } from '@/src/lib/patterns';

export interface ProposalFormMetadata {
  title: string;
  summary: string;
  description: string;
  resources: ProposalResource[];
  media: Media;
}

export interface Media {
  logo: string;
  header: string;
}

const emptyDataStep1: ProposalFormMetadata = {
  title: '',
  summary: '',
  description: '',
  resources: [{ name: '', url: '' }],
  media: { logo: '', header: '' },
};

export const Metadata = () => {
  const { setStep, setDataStep1, dataStep1 } = useNewProposalFormContext();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
  } = useForm<ProposalFormMetadata>({
    defaultValues: dataStep1 ?? emptyDataStep1,
  });

  const {
    fields: resources,
    append,
    remove,
  } = useFieldArray({
    name: 'resources',
    control: control,
  });

  console.log(dataStep1);
  console.log(resources);

  const onSubmit = (data: ProposalFormMetadata) => {
    // Handle submission
    console.log(data);
    setDataStep1(data);
    setStep(2);
  };

  const handleBack = () => {
    const data = getValues();
    setDataStep1(data);
  };

  const handleAddResource = () => {
    append({ name: '', url: '' });
  };

  const handleRemoveResource = (index: number) => {
    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
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
        <div className="space-y-1">
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
        <div className="space-y-1">
          <Label htmlFor="body">Body</Label>
          <ErrorWrapper name="Description" error={errors.description}>
            <Controller
              control={control}
              name="description" // Replace this with the name of the field you want to store the WYSIWYG content
              defaultValue=""
              render={({ field }) => (
                <TextareaWYSIWYG<ProposalFormMetadata>
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
        <fieldset className="space-y-1">
          <Label htmlFor="resources">Resources</Label>
          {resources.map((field, index) => (
            <ResourceInput
              key={field.id}
              onRemove={() => handleRemoveResource(index)}
              register={register}
              getValues={getValues}
              defaultValue={field}
              prefix={`resources.${index}`}
              errors={
                errors?.resources?.[index] as FieldErrors<ProposalResource>
              }
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
  onRemove,
  getValues,
  defaultValue,
  register,
  prefix,
  errors,
}: {
  onRemove: () => void;
  getValues: UseFormGetValues<ProposalFormMetadata>;
  defaultValue: { name: string; url: string };
  register: any;
  prefix: `resources.${number}`;
  errors: FieldErrors<ProposalResource> | undefined;
}) => {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <div className="w-full">
        <ErrorWrapper name="Name" error={errors?.name}>
          <Input
            {...register(`${prefix}.name`, {
              validate: (v: any) => {
                return (
                  !getValues(`${prefix}.url`) ||
                  Boolean(v) ||
                  'You must enter a name'
                );
              },
            })}
            type="text"
            error={errors?.name}
            placeholder="Resource name"
          />
        </ErrorWrapper>
      </div>
      <div className="w-full">
        <ErrorWrapper name="Url" error={errors?.url}>
          <div className="flex h-fit w-full flex-row items-center gap-2">
            <Input
              {...register(`${prefix}.url`, {
                pattern: {
                  value: UrlPattern,
                  message: 'Invalid URL',
                },
                validate: (v: any) => {
                  return (
                    !getValues(`${prefix}.name`) ||
                    Boolean(v) ||
                    'You must enter a URL'
                  );
                },
              })}
              type="text"
              placeholder="Resource URL"
              error={errors?.url}
            />
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 rounded-sm ring-ring ring-offset-2 ring-offset-background focus:outline-none focus:ring-2"
            >
              <HiXMark className="h-5 w-5 cursor-pointer" />
            </button>
          </div>
        </ErrorWrapper>
      </div>
    </div>
  );
};
