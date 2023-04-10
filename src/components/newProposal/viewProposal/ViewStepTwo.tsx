import VotingDetails from '../../proposal/VotingDetails';
import { HeaderCard } from '../../ui/HeaderCard';
import { StepTwoData } from '../newProposalData';

export const ViewStepTwo = ({ data }: { data: StepTwoData | undefined }) => {
  return <VotingDetails proposal={null} />;
};
