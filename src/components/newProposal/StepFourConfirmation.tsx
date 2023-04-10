import { useNewProposalFormContext } from '@/src/pages/NewProposal';
import { StepOneMetadata } from './newProposalData';
import { HeaderCard } from '../ui/HeaderCard';
import { ViewStepOne } from './viewProposal/ViewStepOne';

export const StepFour = () => {
  const { setStep, dataStep1, dataStep3 } = useNewProposalFormContext();

  return <ViewStepOne data={dataStep1} />;
};

