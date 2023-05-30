/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { dummyProposal } from '@/src/hooks/useProposal';
import { getErrorMessage } from '@/src/lib/utils';
import {
  DiamondGovernanceClient,
  ProposalSorting,
  ProposalStatus,
  SortingOrder,
  Proposal,
} from '@plopmenz/diamond-governance-sdk';
import { useEffect, useState } from 'react';

export type UseProposalsData = {
  loading: boolean;
  error: string | null;
  proposals: Proposal[];
  proposalCount: number;
};

export type UseProposalsProps = {
  useDummyData?: boolean;
  status?: ProposalStatus | undefined;
  sorting?: ProposalSorting | undefined;
  order?: SortingOrder | undefined;
  limit?: number | undefined;
};

const defaultProps: UseProposalsProps = {
  useDummyData: false,
  status: undefined,
  sorting: ProposalSorting.Creation,
  order: SortingOrder.Desc,
  limit: undefined,
};

const dummyProposals: Proposal[] = [
  dummyProposal,
  {
    ...dummyProposal,
    id: 1,
    status: ProposalStatus.Executed,
    data: { ...dummyProposal.data, executed: true },
  } as unknown as Proposal,
];

export const useProposals = (props?: UseProposalsProps): UseProposalsData => {
  const { useDummyData, status, sorting, order, limit } = Object.assign(
    defaultProps,
    props
  );

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [proposalsLoading, setProposalsLoading] = useState<boolean>(true);
  const [countLoading, setCountLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useDiamondSDKContext();

  const fetchProposalCount = async (client: DiamondGovernanceClient) => {
    try {
      const proposalCount = await client.sugar.GetProposalCount();
      setProposalCount(proposalCount);
      setCountLoading(false);
    } catch (e) {
      console.error(e);
      setProposalCount(0);
      setCountLoading(false);
    }
  };

  const fetchProposals = async (client: DiamondGovernanceClient) => {
    try {
      const daoProposals: Proposal[] | null = await client.sugar.GetProposals(
        status ? [status] : undefined,
        sorting,
        order === undefined ? SortingOrder.Desc : order,
        undefined,
        limit
      );

      if (daoProposals) {
        setProposals(daoProposals);
        setProposalsLoading(false);
        setError(null);
      }
    } catch (e) {
      console.error(e);
      setProposalsLoading(false);
      setError(getErrorMessage(e));
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setProposalsLoading(false);
    setCountLoading(false);
    setError(null);
    setProposalCount(dummyProposals.length);
    setProposals(
      dummyProposals.filter(
        (p, i) =>
          (limit ? i < limit : true) && (status ? p.status === status : true)
      )
    );
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!client) return;
    setProposalsLoading(true);
    fetchProposals(client);
  }, [client, status, sorting, order]);

  // Only refetch proposal count if the client changes
  useEffect(() => {
    if (useDummyData || !client) return;
    setCountLoading(true);
    fetchProposalCount(client);
  }, [client]);

  return {
    loading: proposalsLoading || countLoading,
    error,
    proposals,
    proposalCount,
  };
};
