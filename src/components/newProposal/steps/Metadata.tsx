/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Button } from '@/src/components/ui/Button';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import { Textarea } from '@/src/components/ui/Textarea';
import { TextareaWYSIWYG } from '@/src/components/ui/TextareaWYSIWYG';
import { UrlPattern } from '@/src/lib/constants/patterns';
import { IsEmptyOrOnlyWhitespace } from '@/src/lib/utils';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { ProposalResource } from '@plopmenz/diamond-governance-sdk';
import {
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetError,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { HiPlus, HiXMark } from 'react-icons/hi2';

export interface ProposalFormMetadata {
  title: string;
  description: string;
  body: string;
  resources: ProposalResource[];
}

const emptyDataStep1: ProposalFormMetadata = {
  title: '',
  description: '',
  body: '',
  resources: [{ name: 'Place for discussion', url: '' }],
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

  const onSubmit = (data: ProposalFormMetadata) => {
    if (!validateOnSubmit(data, setError)) {
      return;
    }
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
              {...register('title', {
                required: true,
                validate: {
                  maxlength: (v) =>
                    v.length <= 140 ||
                    'Title too long (at most 140 characters)',
                  whitespace: (v) =>
                    !IsEmptyOrOnlyWhitespace(v) || 'Please provide a title',
                },
              })}
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
          <Label htmlFor="description">Description</Label>
          <ErrorWrapper name="Description" error={errors.description}>
            <Textarea
              {...register('description', {
                required: true,
                validate: {
                  maxlength: (v) =>
                    v.length <= 512 ||
                    'Title too long (at most 512 characters)',
                  whitespace: (v) =>
                    !IsEmptyOrOnlyWhitespace(v) ||
                    'Please provide a description',
                },
              })}
              placeholder="Description"
              id="description"
              className="..."
              error={errors.description}
            />
          </ErrorWrapper>
        </div>
        <div className="space-y-1">
          <Label htmlFor="body">Body</Label>
          <ErrorWrapper name="Body" error={errors.body}>
            <Controller
              control={control}
              name="body" // Replace this with the name of the field you want to store the WYSIWYG content
              defaultValue=""
              render={({ field }) => (
                <TextareaWYSIWYG<ProposalFormMetadata>
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={() => field.onBlur()}
                  name={field.name}
                  placeholder="Enter your content"
                  error={errors.body}
                  setError={() =>
                    setError('body', {
                      type: 'required',
                      message: 'Body is required',
                    })
                  }
                  clearErrors={() => clearErrors('body')}
                />
              )}
            />
          </ErrorWrapper>
        </div>
        <fieldset className="space-y-1">
          <ErrorWrapper
            name="root.resourceMin"
            error={errors?.root?.resourceMin as any}
            className="space-y-1"
          >
            <Label htmlFor="resources">Resources</Label>
            {resources.map((field, index) => (
              <ResourceInput
                key={field.id}
                onRemove={() => handleRemoveResource(index)}
                register={register}
                getValues={getValues}
                prefix={`resources.${index}`}
                errors={
                  errors?.resources?.[index] as FieldErrors<ProposalResource>
                }
              />
            ))}
          </ErrorWrapper>
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
  register,
  prefix,
  errors,
}: {
  onRemove: () => void;
  getValues: UseFormGetValues<ProposalFormMetadata>;
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
              validate: {
                ifUrlAlsoName: (v: any) => {
                  return (
                    !getValues(`${prefix}.url`) ||
                    Boolean(v) ||
                    'You must enter a name'
                  );
                },
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
                validate: {
                  ifNameAlsoUrl: (v: any) => {
                    return (
                      !getValues(`${prefix}.name`) ||
                      Boolean(v) ||
                      'You must enter a URL'
                    );
                  },
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

/*
 * @returns true if form is valid, false if it is invalid
 * */
function validateOnSubmit(
  data: ProposalFormMetadata,
  setError: UseFormSetError<ProposalFormMetadata>
): boolean {
  // root.resourceMin Validate at least 1 resource
  const filledResources = data.resources.filter((x) => x.name !== '');
  if (filledResources.length === 0) {
    setError('root.resourceMin', {
      type: 'custom',
      message: 'Please add at least one resource for a place for discussion',
    });
    return false;
  }

  return true;
}
