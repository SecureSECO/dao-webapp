import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/src/components/ui/Header';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { HiXMark } from 'react-icons/hi2';

const totalSteps = 4;

const NewProposal = () => {
  const [step, setStep] = useState<number>(1);

  const { register, handleSubmit, setValue, getValues, control } = useForm();
  const isLastStep = step === totalSteps;
  const onSubmit = (data: any) => {
    console.log(data);
    // Handle submission
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ProgressCard step={step}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepContent
            step={step}
            register={register}
            setValue={setValue}
            getValues={getValues}
            control={control}
          />
          {isLastStep ? (
            <Button type="submit">Submit</Button>
          ) : (
            <Button onClick={handleNextStep} type="button">
              Next
            </Button>
          )}
        </form>
      </ProgressCard>
    </div>
  );
};

export default NewProposal;

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
      <Header className="mt-4">Create a proposal</Header>
      {children}
    </Card>
  );
};

const StepContent = ({
  step,
  register,
  setValue,
  getValues,
  control,
}: {
  step: number;
  register: any;
  setValue: any;
  getValues: any;
  control: any;
}) => {
  const [resources, setResources] = useState<
    Array<{ name: string; link: string }>
  >([]);

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

  if (step === 1) {
    return (
      <div className="flex flex-col gap-4">
        <input
          {...register('title')}
          type="text"
          placeholder="Title"
          className="..."
        />
        <input
          {...register('summary')}
          type="text"
          placeholder="Summary"
          className="..."
        />
        <textarea
          {...register('body')}
          placeholder="Body (markdown)"
          className="..."
        />
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
        <Button onClick={handleAddResource} type="button">
          Add resource
        </Button>
      </div>
    );
  }

  // Other steps will go here
  return null;
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
    <div className="flex items-center gap-4">
      <input
        {...register(`${prefix}.name`)}
        type="text"
        value={resource.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Resource name"
        className="..."
      />
      <input
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
      <HiXMark className="cursor-pointer" onClick={onRemove} />
    </div>
  );
};
