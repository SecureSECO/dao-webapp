import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import {
  TokenVotingClient,
  ProposalStatus,
  Erc20TokenDetails,
  TokenType,
} from '@aragon/sdk-client';
// TODO: fix
import { Erc721TokenDetails } from '@aragon/sdk-client/dist/tokenVoting/interfaces';
import { useEffect, useState } from 'react';

type DAO = {
  address: string;
  name: string;
};

type Metadata = {
  title: string;
  summary: string;
};

type Token = Erc20TokenDetails | Erc721TokenDetails | null;

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
    status: ProposalStatus.EXECUTED,
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
      const daoProposals: Proposal[] | null = await client.methods.getProposals(
        {
          daoAddressOrEns: import.meta.env.VITE_DAO_ADDRESS,
        }
      );
      if (daoProposals) {
        setProposals(daoProposals);

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
