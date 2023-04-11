import { HiLink } from 'react-icons/hi2';
import { DefaultMainCardHeader, MainCard } from '../ui/MainCard';
import { Resource } from '../newProposal/newProposalData';

export const ProposalResources = ({
  resources,
  loading,
}: {
  resources: Resource[] | undefined;
  loading: boolean;
}) => (
  <MainCard
    loading={loading}
    className="col-span-full lg:col-span-3"
    icon={HiLink}
    header={
      <DefaultMainCardHeader value={resources?.length ?? 0} label="resources" />
    }
  ></MainCard>
);
