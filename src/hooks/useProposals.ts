import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import {
  TokenVotingClient,
  TokenVotingProposalListItem,
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
};

type Results = {
  yes: bigint;
  no: bigint;
  abstain: bigint;
};

export type Proposal = {
  id: string;
  dao: DAO;
  creatorAddress: string;
  metadata: Metadata;
  startDate: Date;
  endDate: Date;
  status: 'Executed' | 'Pending';
  token: Token;
  results: Results;
};

export type UseProposalsData = {
  loading: boolean;
  error: string | null;
  proposals: Proposal[];
};
export type UseProposalsProps = {
  useDummyData?: boolean;
};

const dummyProposals: Proposal[] = [
  {
    id: '0x12345...',
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
    status: 'Executed',
    token: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'The Token',
      symbol: 'TOK',
      decimals: 18,
    },
    results: {
      yes: 100000n,
      no: 77777n,
      abstain: 0n,
    },
  },
  {
    id: '0x12346...',
    dao: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Cool DAO',
    },
    creatorAddress: '0x1234567890123456789012345678901234567890',
    metadata: {
      title: 'Test Proposal 2',
      summary: 'Test Proposal Summary 2',
    },
    startDate: new Date('2023-03-16T00:00:00.000Z'),
    endDate: new Date('2023-03-23T00:00:00.000Z'),
    status: 'Pending',
    token: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'The Token',
      symbol: 'TOK',
      decimals: 18,
    },
    results: {
      yes: 100000n,
      no: 77777n,
      abstain: 0n,
    },
  },
];

export const useProposals = ({
  useDummyData = false,
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
      const daoProposals: TokenVotingProposalListItem[] | null =
        await client.methods.getProposals({
          daoAddressOrEns: import.meta.env.VITE_DAO_ADDRESS,
        });
      if (daoProposals) {
        // setProposals();
        console.log(daoProposals);

        if (loading) setLoading(false);
        if (error) setError(null);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    if (loading) setLoading(false);
    if (error) setError(null);

    setProposals(dummyProposals);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!votingClient) return;
    fetchProposals(votingClient);
  }, [votingClient]);

  return {
    loading,
    error,
    proposals,
  };
};
