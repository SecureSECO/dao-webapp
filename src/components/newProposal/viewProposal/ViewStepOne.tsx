import { HeaderCard } from '../../ui/HeaderCard';
import { StepOneMetadata } from '../newProposalData';

export const ViewStepOne = ({
  data,
}: {
  data: StepOneMetadata | undefined;
}) => {
  return (
    <HeaderCard title={data?.title ?? 'Proposal has no title'}>
      <h3 className="text-xl">{data?.summary ?? 'Proposal has no summary'} </h3>
      <p className="text-lg">
        {data?.description ?? 'Proposal has no description'}{' '}
      </p>
    </HeaderCard>
  );
};
