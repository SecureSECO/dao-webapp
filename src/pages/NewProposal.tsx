import React, { Children, useState } from 'react';
import {
  useForm,
  UseFormRegister,
  UseFormSetValue,
  Control,
  FieldValues,
  UseFormGetValues,
  FormProvider,
  Controller,
} from 'react-hook-form';
import Header from '@/src/components/ui/Header';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { HiPlus, HiXMark, HiArrowRight } from 'react-icons/hi2';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/RadioGroup';
import { Input } from '@/src/components/ui/Input';
import { Label } from '@/src/components/ui/Label';
import TipTapLink from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextareaWYSIWYG } from '@/src/components/ui/TextareaWYSIWYG';
import { Textarea } from '@/src/components/ui/Textarea';
import { ErrorWrapper } from '@/src/components/ui/ErrorWrapper';
import {
  Action,
  ActionWithdraw,
  ActionMintToken,
  EmptyActionMintToken,
  emptyActionWithdraw,
} from '../lib/Actions';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/Dropdown';
import { Full } from '../components/ui/Address.stories';
import { ProposalActionList } from '../components/proposal/ProposalActionList';

const totalSteps = 4;

const NewProposal = () => {
  const [step, setStep] = useState<number>(1);

  return (
    <div className="flex flex-col gap-6">
      <ProgressCard step={step}>
        <StepContent
          setStep={setStep}
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

      <Button type="submit">{isLastStep ? 'Submit' : 'Next'}</Button>
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
  setStep,
}: {
  step: number;
  StepNavigator?: React.ReactNode;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [stepOneData, setStepOneData] = useState<StepOneMetadata | null>(null);

  switch (step) {
    case 1:
      return (
        <StepOne
          setStep={setStep}
          setStepOneData={setStepOneData}
          StepNavigator={StepNavigator}
        />
      );
    case 2:
      return <StepTwo StepNavigator={StepNavigator} setStep={setStep} />;
    case 3:
      return <StepThree StepNavigator={StepNavigator} setStep={setStep} />;
    default:
      return null;
  }
};

interface Resource {
  name: string;
  url: string;
}

interface Media {
  logo: string;
  header: string;
}

export interface StepOneMetadata {
  title: string;
  summary: string;
  description: string;
  resources: Resource[];
  media: Media;
}

export const StepOne = ({
  StepNavigator,
  setStepOneData,
  setStep,
}: {
  StepNavigator?: React.ReactNode;
  setStepOneData: React.Dispatch<React.SetStateAction<StepOneMetadata | null>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
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
  } = useForm<StepOneMetadata>({});

  const onSubmit = (data: StepOneMetadata) => {
    console.log('hello');
    console.log(data);
    // Handle submission
    setStep(2);
  };

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
                  setError={setError}
                  clearErrors={clearErrors}
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

export const StepTwo = ({
  StepNavigator,
  setStep,
}: {
  StepNavigator?: React.ReactNode;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { register, getValues, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    setStep(3);
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <VotingOption register={register} />
        <StartTime register={register} getValues={getValues} />
        <EndTime register={register} getValues={getValues} />
      </div>
      {StepNavigator}
    </form>
  );
};

export const VotingOption = ({ register }: { register: any }) => {
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

export const StartTime = ({
  register,
  getValues,
}: {
  register: any;
  getValues: any;
}) => {
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

export const EndTime = ({
  register,
  getValues,
}: {
  register: any;
  getValues: any;
}) => {
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

const StepThree = ({
  StepNavigator,
  setStep,
}: {
  StepNavigator?: React.ReactNode;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { register, getValues, handleSubmit, setValue } = useForm();

  const [actions, setActions] = useState<Action[]>([]);

  const onSubmit = (data: any) => {
    console.log(data);
    setStep(4);
    // TODO: Handle submission
  };

  const handleAddWithdrawAssetsAction = () => {
    setActions((prev) => [...prev, emptyActionWithdraw]);
  };

  const handleAddMintTokensAction = () => {
    setActions((prev) => [...prev, EmptyActionMintToken]);
  };

  const AddAction = () => (
    <Dialog>
      <DialogTrigger>Add action</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add action</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogClose className="flex flex-col gap-2">
          <Button
            label="Withdraw assets"
            variant="subtle"
            icon={HiArrowRight}
            onClick={handleAddWithdrawAssetsAction}
          />
          <Button
            label="Mint tokens"
            variant="subtle"
            icon={HiArrowRight}
            onClick={handleAddMintTokensAction}
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <span>If option yes wins</span>
        {actions.length === 0 ? (
          <AddAction />
        ) : (
          <>
            <ProposalActionList
              actions={actions}
              register={register}
              setValue={setValue}
            />
            <AddAction />
          </>
        )}
      </div>
      {StepNavigator}
    </form>
  );
};
