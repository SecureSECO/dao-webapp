import React, { useState } from 'react';
import Header from '@/src/components/ui/Header';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { StepOneMetadata } from '../components/newProposal/newProposalData';
import { StepTwo } from '../components/newProposal/StepTwoVoting';
import { StepThree } from '../components/newProposal/StepThreeActions';
import { StepOne } from '../components/newProposal/StepOneMetadata';

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
