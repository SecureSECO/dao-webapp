import { useNewProposalFormContext } from '@/src/pages/NewProposal';
import { StepOneMetadata } from './newProposalData';
import { HeaderCard } from '../ui/HeaderCard';
import { ViewStepOne } from './viewProposal/ViewStepOne';

export const StepFour = () => {
  const { setStep, dataStep1, dataStep2, dataStep3 } =
    useNewProposalFormContext();

  return (
    <div>
      <ViewStepOne data={dataStep1} />;{/* <ViewStepTwo data={dataStep2} /> */}
    </div>
  );
};
