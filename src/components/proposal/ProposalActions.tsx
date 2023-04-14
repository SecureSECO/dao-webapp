import CheckList from '@/src/components/icons/CheckList';
import { Card } from '@/src/components/ui/Card';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { DaoAction } from '@aragon/sdk-client';
import React from 'react';

const ProposalActions = ({
  actions,
  loading = false,
  className,
}: {
  actions: DaoAction[] | undefined;
  loading?: boolean;
  className?: string;
}) => {
  return (
    <MainCard
      loading={loading}
      className={className + ' shrink'}
      icon={CheckList}
      header={
        <DefaultMainCardHeader value={actions?.length ?? 0} label="actions" />
      }
    >
      {!actions || actions.length === 0 ? (
        <div className="italic text-slate-500 dark:text-slate-400">
          No actions attached
        </div>
      ) : (
        <ul className="space-y-2">
          {actions.map((action) => (
            <li key={action.data.reduce((acc, v) => acc + v, '')}>
              <Card padding="sm" variant="light">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {action.to}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </MainCard>
  );
};

export default ProposalActions;
