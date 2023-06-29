/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { dummyProposal } from '@/src/hooks/useProposal';
import { getErrorMessage } from '@/src/lib/utils';
import {
  DiamondGovernanceClient,
  Proposal,
  ProposalSorting,
  ProposalStatus,
  SortingOrder,
} from '@secureseco-dao/diamond-governance-sdk';

export type UseProposalsData = {
  loading: boolean;
  error: string | null;
  proposals: Proposal[];
  proposalCount: number;
  filteredProposalCount: number | null;
  countLoading: boolean;
};

export type UseProposalsProps = {
  useDummyData?: boolean;
  status?: ProposalStatus | undefined;
  sorting?: ProposalSorting | undefined;
  order?: SortingOrder | undefined;
  limit?: number | undefined;
  fromIndex?: number | undefined;
};

const defaultProps: UseProposalsProps = {
  useDummyData: false,
  status: undefined,
  sorting: ProposalSorting.Creation,
  order: SortingOrder.Desc,
  limit: undefined,
  fromIndex: undefined,
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

/**
 * Hook to fetch the proposals of the DAO that the current Diamond Governance client has been instantiated with.
 * @param props The properties to configure the hook.
 * @param props.useDummyData Whether to use dummy data instead of fetching the proposals from the DAO.
 * @param props.status The status of the proposals to fetch.
 * @param props.sorting The sorting method to use for the proposals.
 * @param props.order The order to sort the proposals in.
 * @param props.limit The maximum number of proposals to return.
 * @param props.fromIndex The index of the first proposal to return.
 * @returns An object containing the proposals, the total number of proposals, the number of proposals when applying the
 * given filters, loading state, error state and a separate loading state for the proposal count.
 */
export const useProposals = (props?: UseProposalsProps): UseProposalsData => {
  const { useDummyData, status, sorting, order, limit, fromIndex } =
    Object.assign(defaultProps, props);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [filteredProposalCount, setFilteredProposalCount] = useState<
    number | null
  >(null);
  const [proposalsLoading, setProposalsLoading] = useState<boolean>(true);
  const [countLoading, setCountLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { anonClient } = useDiamondSDKContext();

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

  const fetchFilteredProposalCount = async (
    client: DiamondGovernanceClient
  ) => {
    try {
      const proposalCount = await client.sugar.GetFilteredProposalCount(
        status ? [status] : undefined
      );
      setFilteredProposalCount(proposalCount);
    } catch (e) {
      console.error(e);
      setFilteredProposalCount(0);
    }
  };

  const fetchProposals = async (client: DiamondGovernanceClient) => {
    try {
      const daoProposals: Proposal[] | null = await client.sugar.GetProposals(
        status ? [status] : undefined,
        sorting,
        order,
        fromIndex,
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
    if (!anonClient) return;
    setProposalsLoading(true);
    fetchProposals(anonClient);
  }, [anonClient, status, sorting, order, fromIndex, limit]);

  useEffect(() => {
    if (useDummyData) return;
    if (!anonClient) return;
    fetchFilteredProposalCount(anonClient);
  }, [anonClient, status]);

  // Only refetch proposal count if the client changes
  useEffect(() => {
    if (useDummyData || !anonClient) return;
    setCountLoading(true);
    fetchProposalCount(anonClient);
  }, [anonClient]);

  return {
    loading: proposalsLoading || countLoading,
    error,
    proposals,
    proposalCount,
    filteredProposalCount,
    countLoading,
  };
};
