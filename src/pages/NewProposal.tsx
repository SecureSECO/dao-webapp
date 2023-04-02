import React, { Children, useState } from 'react';
import {
  useForm,
  UseFormRegister,
  UseFormSetValue,
  Control,
  FieldValues,
  UseFormGetValues,
  FormProvider,
  useFormContext,
  Controller,
} from 'react-hook-form';
import Header from '@/src/components/ui/Header';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import TipTapLink from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextareaWYSIWYG } from '@/src/components/ui/TextareaWYSIWYG';
import { Textarea } from '@/src/components/ui/Textarea';

const totalSteps = 4;

const NewProposal = () => {
  const [step, setStep] = useState<number>(1);
  const [stepOneData, setStepOneData] = useState<any>(null);

  console.log('current step', step);
  return (
    <div className="flex flex-col gap-6">
      <ProgressCard step={step}>
        <StepContent
          step={step}
          StepNavigator={<StepNavigator step={step} setStep={setStep} />}
        />
      </ProgressCard>
    </div>
  );
};

export default NewProposal;

const StepNavigator = ({
  step,
  setStep,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    }
    // if (step < totalSteps && formState.isValid) {
    //   setStep(step + 1);
    // } else if (!formState.isValid) {
    //   setFormError('Please fill in all required fields');
    //   console.log('error', formState.errors.title);
    // }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isLastStep = step === totalSteps;

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handlePrevStep} type="button" disabled={step === 1}>
        Back
      </Button>
      {isLastStep ? (
        <Button type="submit">Submit</Button>
      ) : (
        <Button onClick={handleNextStep} type="button">
          Next
        </Button>
      )}
    </div>
  );
};

export const ProgressCard = ({
  step,
  children,
}: {
  step: number;
  children?: React.ReactNode;
}) => {
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <p className="text-primary dark:text-primary-500">New proposal</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Step {step} of {totalSteps}
        </p>
      </div>
      <Progress value={(step * 100) / totalSteps} className="w-full" />
      <Header className="my-4">Create a proposal</Header>
      {children}
    </Card>
  );
};

const StepContent = ({
  step,
  StepNavigator,
}: {
  step: number;
  StepNavigator?: React.ReactNode;
}) => {
  if (step === 1) {
    return <StepOne StepNavigator={StepNavigator}></StepOne>;
  }
  if (step === 2) {
    return <StepTwo StepNavigator={StepNavigator}></StepTwo>;
  }

  // Other steps will go here
  return null;
};

interface Resource {
  name: string;
  url: string;
}

interface Media {
  logo: string;
  header: string;
}

interface StepOneMetadata {
  title: string;
  summary: string;
  description: string;
  resources: Resource[];
  media: Media;
}

export const StepOne = ({
  StepNavigator,
}: {
  StepNavigator?: React.ReactNode;
}) => {
  const [resources, setResources] = useState<
    Array<{ name: string; link: string }>
  >([{ name: '', link: '' }]);

  const { register, getValues, setValue, control } = useForm<StepOneMetadata>();

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle submission
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title of the proposal</Label>
          <Input
            {...register('title', { required: true, maxLength: 2 })}
            type="text"
            placeholder="Title"
            id="title"
            className="..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            {...register('summary', { required: true })}
            placeholder="Summary*"
            id="summary"
            className="..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="body">Body</Label>
          <Controller
            control={control}
            name="body" // Replace this with the name of the field you want to store the WYSIWYG content
            rules={{ required: false }} // Add any validation rules you need
            defaultValue=""
            render={({ field }) => (
              <TextareaWYSIWYG
                value={field.value}
                onChange={field.onChange}
                onBlur={() => field.onBlur()}
                name={field.name}
                placeholder="Enter your content"
              />
            )}
          />
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
      {StepNavigator}
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
    <div className="flex items-center gap-2">
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
      <HiXMark className="h-10 w-10 cursor-pointer" onClick={onRemove} />
    </div>
  );
};

export const StepTwo = ({
  StepNavigator,
}: {
  StepNavigator?: React.ReactNode;
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <VotingOption />
        <StartTime />
        <EndTime />
      </div>
      {StepNavigator}
    </form>
  );
};

export const VotingOption = () => {
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend>Options</legend>
      <RadioGroup {...register('option')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes-no-abstain" id="yes-no-abstain" />
          <h2>
            Yes, no, or abstain (Members can vote for, against, or abstain)
          </h2>
        </div>
      </RadioGroup>
    </fieldset>
  );
};

export const StartTime = () => {
  const { register, getValues } = useFormContext();

  return (
    <fieldset>
      <legend>Start time</legend>
      <RadioGroup {...register('start_time_type')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="now" id="start-now" />
          <h2>Now</h2>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="start-custom" />
          <h2>Custom</h2>
        </div>
      </RadioGroup>
      {getValues('start_time_type') === 'custom' && (
        <Input
          {...register('start_time')}
          type="datetime-local"
          placeholder="Start time"
        />
      )}
    </fieldset>
  );
};

export const EndTime = () => {
  const { register, getValues } = useFormContext();

  return (
    <fieldset>
      <legend>End time</legend>
      <RadioGroup {...register('end_time_type')} required>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="duration"
            id="end-duration"
            className="group"
          />
          <h2>Duration</h2>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="end-custom" />
          <h2>Custom</h2>
        </div>
      </RadioGroup>
      {getValues('end_time_type') === 'duration' ? (
        <div className="data-[state=checked] flex gap-2">
          <Input
            {...register('duration_minutes')}
            type="number"
            placeholder="Minutes"
            min="0"
            max="525600" // 365 days in minutes
          />
          <Input
            {...register('duration_hours')}
            type="number"
            placeholder="Hours"
            min="0"
            max="8760" // 365 days in hours
          />
          <Input
            {...register('duration_days')}
            type="number"
            placeholder="Days"
            min="0"
            max="365"
          />
        </div>
      ) : (
        getValues('end_time_type') === 'custom' && (
          <input
            {...register('end_time')}
            type="datetime-local"
            placeholder="End time"
            min={getValues('start_time')}
          />
        )
      )}
    </fieldset>
  );
};
