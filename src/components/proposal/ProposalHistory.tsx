import History from '@/src/components/icons/History';
import { MainCard } from '@/src/components/ui/MainCard';
import { DetailedProposal } from '@/src/hooks/useProposal';
import React from 'react';

const ProposalHistory = ({
  proposal,
  loading = false,
  className,
}: {
  proposal: DetailedProposal | null;
  loading?: boolean;
  className?: string;
}) => {
  return (
    <MainCard
      loading={loading}
      className={className + ' shrink'}
      icon={History}
      header={<p className="text-2xl font-medium">History</p>}
    ></MainCard>
  );
};

export default ProposalHistory;
