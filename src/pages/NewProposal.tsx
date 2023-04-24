/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createContext, useContext, useState } from 'react';
import Header from '@/src/components/ui/Header';
import { Progress } from '@/src/components/ui/Progress';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  ProposalFormVotingSettings,
  Voting,
} from '@/src/components/newProposal/steps/Voting';
import {
  Actions,
  ProposalFormActions,
} from '@/src/components/newProposal/steps/Actions';
import {
  Metadata,
  ProposalFormMetadata,
} from '@/src/components/newProposal/steps/Metadata';
import { Confirmation } from '@/src/components/newProposal/steps/Confirmation';
import { Link } from '@/src/components/ui/Link';
import { HiChevronLeft } from 'react-icons/hi2';

const totalSteps = 4;

const NewProposal = () => {
  return (
    <div className="space-y-2">
      {/* Back button */}
      <Link
        to="/governance"
        icon={HiChevronLeft}
        variant="outline"
        label="All proposals"
        className="text-lg"
      />
      <div className="flex flex-col gap-6">
        <NewProposalFormProvider>
          <ProgressCard>
            <StepContent />
          </ProgressCard>
        </NewProposalFormProvider>
      </div>
    </div>
  );
};

export default NewProposal;

export type NewProposalFormContextProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  dataStep1: ProposalFormMetadata | undefined;
  setDataStep1: React.Dispatch<
    React.SetStateAction<ProposalFormMetadata | undefined>
  >;
  dataStep2: ProposalFormVotingSettings | undefined;
  setDataStep2: React.Dispatch<
    React.SetStateAction<ProposalFormVotingSettings | undefined>
  >;
  dataStep3: ProposalFormActions | undefined;
  setDataStep3: React.Dispatch<
    React.SetStateAction<ProposalFormActions | undefined>
  >;
};

export const NewProposalFormContext = createContext(
  {} as NewProposalFormContextProps
);

export const useNewProposalFormContext = () =>
  useContext(NewProposalFormContext);

export type NewProposalFormProviderProps = {
  children: any;
  step?: number;
  dataStep1?: ProposalFormMetadata | undefined;
  dataStep2?: ProposalFormVotingSettings | undefined;
  dataStep3?: ProposalFormActions | undefined;
};
export const NewProposalFormProvider = ({
  children,
  ...props
}: NewProposalFormProviderProps) => {
  const [step, setStep] = useState<number>(props?.step ?? 1);
  const [dataStep1, setDataStep1] = useState<ProposalFormMetadata | undefined>(
    props.dataStep1
  );
  const [dataStep2, setDataStep2] = useState<
    ProposalFormVotingSettings | undefined
  >(props.dataStep2);
  const [dataStep3, setDataStep3] = useState<ProposalFormActions | undefined>(
    props.dataStep3
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

export const StepNavigator = ({ onBack }: { onBack?: () => void }) => {
  const { step, setStep } = useNewProposalFormContext();

  const handlePrevStep = () => {
    if (onBack) {
      onBack();
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isLastStep = step === totalSteps;

  return (
    <div className="flex items-center gap-2">
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
    <Card className="flex flex-col gap-1 px-1 sm:px-6">
      <div className="flex w-full items-center justify-between">
        <p className="text-primary">New proposal</p>
        <p className="text-sm text-highlight-foreground/80">
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
      return <Metadata />;
    case 2:
      return <Voting />;
    case 3:
      return <Actions />;
    case 4:
      return <Confirmation />;
    default:
      return null;
  }
};
