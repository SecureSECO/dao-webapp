/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

type UseMembersProps = {
  useDummyData?: boolean;
  includeBalances?: boolean;
  limit?: number | undefined;
};

const defaultProps: UseMembersProps = {
  useDummyData: false,
  includeBalances: true,
  limit: undefined,
};

type UseMembersData = {
  loading: boolean;
  error: string | null;
  members: Member[];
  memberCount: number;
  isMember: (address: string) => boolean;
};

export type Member = { address: string; bal: BigNumber | null };

const dummyMembers: Member[] = [];

export const useMembers = (props?: UseMembersProps): UseMembersData => {
  const { useDummyData, includeBalances, limit } = Object.assign(
    defaultProps,
    props
  );

  const [members, setMembers] = useState<Member[]>([]);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useDiamondSDKContext();

  /**
   * Fetch balances for a list of addresses
   * @param addressList List of addresses to fetch balances for
   * @returns A list of Member objects
   * @see Member for the type of object returned in the list
   */
  const fetchBalances = async (addressList: string[]): Promise<Member[]> => {
    if (!client) throw new Error('Client not set');
    return Promise.all(
      addressList.map(async (address) => {
        try {
          const contract = await client.pure.IERC20();
          const bal = await contract.balanceOf(address);
          return {
            address,
            bal: bal,
          };
        } catch (e) {
          console.error(e);
          return {
            address,
            bal: null,
          };
        }
      })
    );
  };

  const fetchMembers = async (client: DiamondGovernanceClient) => {
    try {
      // Fetch the list of address that are members of the DAO
      const addressList: string[] = await client.sugar.GetMembers();

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
          return b.bal.sub(a.bal).toNumber();
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
    if (!client) return;
    fetchMembers(client);
  }, [client]);

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
