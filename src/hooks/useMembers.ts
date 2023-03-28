import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { TokenVotingClient } from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

type UseMembersProps = {
  useDummyData?: boolean;
};

type UseMembersData = {
  loading: boolean;
  error: string | null;
  members: Member[];
};

// TODO: add REP balance to this, fetch it from wagmi
export type Member = string;

const dummyMembers: Member[] = [];

export const useMembers = ({
  useDummyData = false,
}: UseMembersProps): UseMembersData => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingClient, votingPluginAddress } = useAragonSDKContext();

  const fetchMembers = async (client: TokenVotingClient) => {
    if (!votingPluginAddress) {
      setLoading(false);
      setError('Voting plugin address not set');
      return;
    }

    try {
      const daoMembers: Member[] | null = await client.methods.getMembers(
        votingPluginAddress
      );
      if (daoMembers) {
        setMembers(daoMembers);
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

    setMembers(dummyMembers);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!votingClient) return;
    fetchMembers(votingClient);
  }, [votingClient]);

  return {
    loading,
    error,
    members,
  };
};
