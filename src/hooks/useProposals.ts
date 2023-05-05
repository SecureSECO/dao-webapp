/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import {
  TokenVotingClient,
  ProposalStatus,
  TokenType,
  ProposalSortBy,
  SortDirection,
} from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

type DAO = {
  address: string;
  name: string;
};

type Metadata = {
  title: string;
  summary: string;
};

type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  type: TokenType;
};

type Result = {
  yes: bigint;
  no: bigint;
  abstain: bigint;
};

type Settings = {
  supportThreshold: number;
  duration: number;
  minParticipation: number;
};

export type Proposal = {
  id: string;
  dao: DAO;
  creatorAddress: string;
  metadata: Metadata;
  startDate: Date;
  endDate: Date;
  status: ProposalStatus;
  token: Token;
  result: Result;
  settings: Settings;
  totalVotingWeight: bigint;
};

export type UseProposalsData = {
  loading: boolean;
  error: string | null;
  proposals: Proposal[];
};
export type UseProposalsProps = {
  useDummyData?: boolean;
  status?: ProposalStatus | undefined;
  sortBy?: ProposalSortBy | undefined;
  direction?: SortDirection | undefined;
  limit?: number | undefined;
};

const dummyProposals: Proposal[] = [
  {
    id: '0x22345',
    dao: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Cool DAO',
    },
    creatorAddress: '0x1234567890123456789012345678901234567890',
    metadata: {
      title: 'Test Proposal',
      summary: 'Test Proposal Summary',
    },
    startDate: new Date('2023-03-16T00:00:00.000Z'),
    endDate: new Date('2023-03-23T00:00:00.000Z'),
    status: ProposalStatus.ACTIVE,
    token: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'The Token',
      symbol: 'TOK',
      decimals: 18,
      type: TokenType.ERC20,
    },
    result: {
      yes: 100000n,
      no: 77777n,
      abstain: 0n,
    },
    settings: {
      supportThreshold: 0.5,
      duration: 87000,
      minParticipation: 0.15,
    },
    totalVotingWeight: 1000000000000000000n,
  },
  {
    id: '0x12345',
    dao: {
      address: '0x123456789012345678901234567890123456789',
      name: 'Cool DAO',
    },
    creatorAddress: '0x1234567890123456789012345678901234567890',
    metadata: {
      title: 'Test Proposal 2',
      summary: 'Test Proposal Summary 2',
    },
    startDate: new Date('2023-03-16T00:00:00.000Z'),
    endDate: new Date('2023-03-23T00:00:00.000Z'),
    status: ProposalStatus.PENDING,
    token: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'The Token',
      symbol: 'TOK',
      decimals: 18,
      type: TokenType.ERC20,
    },
    result: {
      yes: 100000n,
      no: 77777n,
      abstain: 0n,
    },
    settings: {
      supportThreshold: 0.5,
      duration: 87000,
      minParticipation: 0.15,
    },
    totalVotingWeight: 1000000000000000000n,
  },
];

export const useProposals = ({
  useDummyData = false,
  status = undefined,
  sortBy = ProposalSortBy.CREATED_AT,
  direction = SortDirection.DESC,
  limit = undefined,
}: UseProposalsProps): UseProposalsData => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingPluginAddress, votingClient } = useAragonSDKContext();

  const fetchProposals = async (client: TokenVotingClient) => {
    if (!votingPluginAddress) {
      setLoading(false);
      setError('Voting plugin address not set');
      return;
    }

    try {
      const daoProposals: Proposal[] | null =
        (await client.methods.getProposals({
          daoAddressOrEns: import.meta.env.VITE_DAO_ADDRESS,
          status,
          sortBy,
          direction: direction ?? SortDirection.DESC,
          limit,
        })) as Proposal[];

      if (daoProposals) {
        setProposals(daoProposals);
        setLoading(false);
        setError(null);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setProposals(dummyProposals);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!votingClient) return;
    setLoading(true);
    fetchProposals(votingClient);
  }, [votingClient, status, sortBy, direction]);

  return {
    loading,
    error,
    proposals,
  };
};