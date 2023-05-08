/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { getErrorMessage } from '@/src/lib/utils';
import {
  DiamondGovernanceClient,
  ProposalSorting,
  ProposalStatus,
  SortingOrder,
} from '@plopmenz/diamond-governance-sdk';
import { Proposal } from '@plopmenz/diamond-governance-sdk/dist/sdk/src/sugar/proposal';
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

const dummyProposals: Proposal[] = [
  // {
  //   id: '0x22345',
  //   dao: {
  //     address: '0x1234567890123456789012345678901234567890',
  //     name: 'Cool DAO',
  //   },
  //   creatorAddress: '0x1234567890123456789012345678901234567890',
  //   metadata: {
  //     title: 'Test Proposal',
  //     summary: 'Test Proposal Summary',
  //   },
  //   startDate: new Date('2023-03-16T00:00:00.000Z'),
  //   endDate: new Date('2023-03-23T00:00:00.000Z'),
  //   status: ProposalStatus.ACTIVE,
  //   token: {
  //     address: '0x1234567890123456789012345678901234567890',
  //     name: 'The Token',
  //     symbol: 'TOK',
  //     decimals: 18,
  //     type: TokenType.ERC20,
  //   },
  //   result: {
  //     yes: 100000n,
  //     no: 77777n,
  //     abstain: 0n,
  //   },
  //   settings: {
  //     supportThreshold: 0.5,
  //     duration: 87000,
  //     minParticipation: 0.15,
  //   },
  //   totalVotingWeight: 1000000000000000000n,
  // },
  // {
  //   id: '0x12345',
  //   dao: {
  //     address: '0x123456789012345678901234567890123456789',
  //     name: 'Cool DAO',
  //   },
  //   creatorAddress: '0x1234567890123456789012345678901234567890',
  //   metadata: {
  //     title: 'Test Proposal 2',
  //     summary: 'Test Proposal Summary 2',
  //   },
  //   startDate: new Date('2023-03-16T00:00:00.000Z'),
  //   endDate: new Date('2023-03-23T00:00:00.000Z'),
  //   status: ProposalStatus.PENDING,
  //   token: {
  //     address: '0x1234567890123456789012345678901234567890',
  //     name: 'The Token',
  //     symbol: 'TOK',
  //     decimals: 18,
  //     type: TokenType.ERC20,
  //   },
  //   result: {
  //     yes: 100000n,
  //     no: 77777n,
  //     abstain: 0n,
  //   },
  //   settings: {
  //     supportThreshold: 0.5,
  //     duration: 87000,
  //     minParticipation: 0.15,
  //   },
  //   totalVotingWeight: 1000000000000000000n,
  // },
];

export const useProposals = ({
  useDummyData = false,
  status = undefined,
  sorting = ProposalSorting.Creation,
  order = SortingOrder.Desc,
  limit = undefined,
}: UseProposalsProps): UseProposalsData => {
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
        order ?? SortingOrder.Desc
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
    setError(null);
    setProposals(dummyProposals);
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
