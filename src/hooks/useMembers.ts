import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import {
  TokenVotingClient,
  TokenVotingProposalListItem,
} from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

type UseMembersProps = {
  useDummyData?: boolean;
};

type UseMembersData = {};

type Member = {};

const dummyMembers: Member[] = [];

export const useMembers = ({
  useDummyData = false,
}: UseMembersProps): UseMembersData => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingPluginAddress, contextPlugin } = useAragonSDKContext();

  const fetchMembers = async (client: TokenVotingClient) => {
    if (!votingPluginAddress) {
      setLoading(false);
      setError('Voting plugin address not set');
      return;
    }

    try {
      // const daoProposals: TokenVotingProposalListItem[] | null =
      //   await client.methods.getProposals(votingPluginAddress);
      // if (daoProposals) {
      //   // setProposals();
      //   console.log(daoProposals);
      //   if (loading) setLoading(false);
      //   if (error) setError(null);
      // }
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
    if (!contextPlugin) return;
    const client = new TokenVotingClient(contextPlugin);
    fetchMembers(client);
  }, [contextPlugin]);

  return {
    loading,
    error,
    members,
  };
};
