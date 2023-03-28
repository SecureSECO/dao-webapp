import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { TokenVotingClient } from '@aragon/sdk-client';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

type UseMembersProps = {
  useDummyData?: boolean;
  limit?: number | undefined;
};

type UseMembersData = {
  loading: boolean;
  error: string | null;
  members: Member[];
  memberCount: number;
};

// TODO: add REP balance to this, fetch it from wagmi
export type Member = { address: string; bal: number };

const dummyMembers: Member[] = [];

export const useMembers = ({
  useDummyData = false,
  limit = undefined,
}: UseMembersProps): UseMembersData => {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingClient, votingPluginAddress, repTokenContract } =
    useAragonSDKContext();

  const fetchBalance = async (address: string) => {
    if (!repTokenContract) return;
    const bal = await repTokenContract.balanceOf(address);
    return bal;
  };

  const fetchMembers = async (client: TokenVotingClient) => {
    if (!votingPluginAddress) {
      setLoading(false);
      setError('Voting plugin address not set');
      return;
    }

    try {
      // Fetch the list of address that are members of the DAO
      const addressList: string[] | null = await client.methods.getMembers(
        votingPluginAddress
      );
      if (addressList) {
        // Fetch the balance of each member
        const daoMembers: Member[] = await Promise.all(
          addressList.map(
            async (address) =>
              new Promise((resolve, reject) => {
                fetchBalance(address)
                  .then((bal: BigNumber) => {
                    return resolve({
                      address,
                      bal: Number(bal.toBigInt() / BigInt(10 ** 18)),
                    });
                  })
                  .catch(reject);
              })
          )
        );

        daoMembers.sort((a, b) => b.bal - a.bal);
        if (limit) setMembers(daoMembers.splice(0, limit));
        else setMembers(daoMembers);
        setMemberCount(addressList.length);

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
    memberCount,
  };
};
