/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { CHAIN_METADATA } from '@/src/lib/constants/chains';
import { getErrorMessage } from '@/src/lib/utils';
import { TokenVotingClient } from '@aragon/sdk-client';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

type UseMembersProps = {
  useDummyData?: boolean;
  includeBalances?: boolean;
  limit?: number | undefined;
};

type UseMembersData = {
  loading: boolean;
  error: string | null;
  members: Member[];
  memberCount: number;
  isMember: (address: string) => boolean;
};

export type Member = { address: string; bal: number | null };

const dummyMembers: Member[] = [];

export const useMembers = ({
  useDummyData = false,
  includeBalances = true,
  limit = undefined,
}: UseMembersProps): UseMembersData => {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { votingClient, votingPluginAddress, repTokenContract } =
    useAragonSDKContext();

  /**
   * Fetch the REP balance for a single address. Throws an error if the REP token contract is not set
   * @returns The REP balance of the given address
   */
  const fetchBalance = async (address: string): Promise<BigNumber> => {
    if (!repTokenContract) throw new Error('REP token contract not set');
    return repTokenContract.balanceOf(address);
  };

  /**
   * Fetch balances for a list of addresses
   * @param addressList List of addresses to fetch balances for
   * @returns A list of Member objects
   * @see Member for the type of object returned in the list
   */
  const fetchBalances = async (addressList: string[]): Promise<Member[]> => {
    return Promise.all(
      addressList.map(
        async (address) =>
          new Promise((resolve) => {
            fetchBalance(address)
              .then((bal: BigNumber) => {
                return resolve({
                  address,
                  bal: Number(
                    bal.toBigInt() /
                      BigInt(10 ** CHAIN_METADATA.rep.nativeCurrency.decimals)
                  ),
                });
              })
              .catch(() =>
                resolve({
                  address,
                  bal: null,
                })
              );
          })
      )
    );
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
        let daoMembers;
        if (includeBalances) daoMembers = await fetchBalances(addressList);
        else
          daoMembers = addressList.map((address) => {
            return {
              address,
              bal: null,
            };
          });

        // Sort the members by balance, descending
        daoMembers.sort((a, b) => {
          if (a.bal === null) return 1;
          if (b.bal === null) return -1;
          return b.bal - a.bal;
        });
        // If a limit is set, only return that many members (with the highest balance)
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

  /**
   * Check if an address is a member of the DAO
   * @param address The address to check
   * @returns True if the address is a member, false otherwise
   */
  const isMember = (address: string): boolean => {
    return members.some((member) => member.address === address);
  };

  return {
    loading,
    error,
    members,
    memberCount,
    isMember,
  };
};
