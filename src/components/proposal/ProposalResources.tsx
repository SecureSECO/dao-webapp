import { HiLink } from 'react-icons/hi2';
import { DefaultMainCardHeader, MainCard } from '../ui/MainCard';
import { Resource } from '../newProposal/newProposalData';
import { cn } from '@/src/lib/utils';

export const ProposalResources = ({
  resources,
  loading,
  className,
}: {
  resources: Resource[] | undefined;
  loading?: boolean;
  className?: string;
}) => (
  <MainCard
    loading={loading ?? resources ? true : false}
    className={cn('col-span-full lg:col-span-3', className)}
    icon={HiLink}
    header={
      <DefaultMainCardHeader value={resources?.length ?? 0} label="resources" />
    }
  ></MainCard>
);
