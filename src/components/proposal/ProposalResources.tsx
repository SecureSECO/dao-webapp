import { HiArrowTopRightOnSquare, HiLink } from 'react-icons/hi2';
import { DefaultMainCardHeader, MainCard } from '../ui/MainCard';
import { Resource } from '../newProposal/newProposalData';
import { Card } from '@/src/components/ui/Card';
import { useEffect } from 'react';

export const ProposalResources = ({
  resources,
  loading = false,
  className,
}: {
  resources: Resource[] | undefined;
  loading?: boolean;
  className?: string;
}) => {
  // Filter out empty entries in resources array
  const filtered = resources?.filter((resource) => resource.url !== '');

  useEffect(() => {
    console.log('resources', resources);
  }, [resources]);

  return (
    <MainCard
      loading={loading ?? resources ? true : false}
      className={className}
      icon={HiLink}
      header={
        <DefaultMainCardHeader
          value={resources?.length ?? 0}
          label="resources"
        />
      }
    >
      {!filtered || filtered.length === 0 ? (
        <div className="text-slate-500 dark:text-slate-400">
          No resources added
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((resource) => (
            <li key={resource.url}>
              <Card padding="sm" variant="light">
                <a
                  href={resource.url}
                  rel="noreferrer"
                  target="_blank"
                  className="flex flex-row items-center gap-x-2 font-medium text-primary-500 transition-colors duration-200 hover:text-primary dark:hover:text-primary-400"
                >
                  {resource.name}
                  <HiArrowTopRightOnSquare className="h-4 w-4 shrink-0" />
                </a>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {resource.url}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </MainCard>
  );
};
