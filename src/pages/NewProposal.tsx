import React, { createContext, useContext, useState } from 'react';
import Header from '@/src/components/ui/Header';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  StepOneMetadata,
  StepTwoData,
} from '../components/newProposal/newProposalData';
import { StepTwo } from '../components/newProposal/StepTwoVoting';
import { StepThree } from '../components/newProposal/StepThreeActions';
import { StepOne } from '../components/newProposal/StepOneMetadata';
import { StepFour } from '../components/newProposal/StepFourConfirmation';
import { StepThreeData } from '../components/newProposal/newProposalData';

const totalSteps = 4;

const NewProposal = () => {
  return (
    <div className="flex flex-col gap-6">
      <NewProposalFormProvider>
        <ProgressCard>
          <StepContent />
        </ProgressCard>
      </NewProposalFormProvider>
    </div>
  );
};

export default NewProposal;

export type NewProposalFormContextProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  dataStep1: StepOneMetadata | undefined;
  setDataStep1: React.Dispatch<
    React.SetStateAction<StepOneMetadata | undefined>
  >;
  dataStep2: StepTwoData | undefined;
  setDataStep2: React.Dispatch<React.SetStateAction<StepTwoData | undefined>>;
  dataStep3: StepThreeData | undefined;
  setDataStep3: React.Dispatch<React.SetStateAction<StepThreeData | undefined>>;
};

export const NewProposalFormContext = createContext(
  {} as NewProposalFormContextProps
);

export const useNewProposalFormContext = () =>
  useContext(NewProposalFormContext);

export const NewProposalFormProvider = ({ children }: { children: any }) => {
  const [step, setStep] = useState<number>(1);
  const [dataStep1, setDataStep1] = useState<StepOneMetadata | undefined>(
    undefined
  );
  const [dataStep2, setDataStep2] = useState<StepTwoData | undefined>(
    undefined
  );
  const [dataStep3, setDataStep3] = useState<StepThreeData | undefined>(
    undefined
  );

  return (
    <NewProposalFormContext.Provider
      value={{
        step,
        setStep,
        dataStep1,
        setDataStep1,
        dataStep2,
        setDataStep2,
        dataStep3,
        setDataStep3,
      }}
    >
      {children}
    </NewProposalFormContext.Provider>
  );
};

export const StepNavigator = () => {
  const { step, setStep } = useNewProposalFormContext();

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

export const ProgressCard = ({ children }: { children?: React.ReactNode }) => {
  const { step } = useNewProposalFormContext();
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

const StepContent = () => {
  const { step } = useNewProposalFormContext();
  switch (step) {
    case 1:
      return <StepOne />;
    case 2:
      return <StepTwo />;
    case 3:
      return <StepThree />;
    case 4:
      return <StepFour />;
    default:
      return null;
  }
};
