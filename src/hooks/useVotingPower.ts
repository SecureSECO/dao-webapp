/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

export type CanVote = {
  Yes: boolean;
  No: boolean;
  Abstain: boolean;
};

export type UseVotingPowerData = {
  loading: boolean;
  error: string | null;
  // Voting power of given wallet
  votingPower: BigNumber;
  refetch: () => void;
};

export type UseVotingPowerProps = {
  address: string | undefined;
  blockNumber: BigNumber | undefined;
  useDummyData?: boolean;
};

/**
 * Hook to fetch the voting power (rep balance) of a given wallet
 * @param props.address Address of the wallet to fetch the voting power of
 * @returns Object containing the votingPower and a refetch function, as well as loading and error states
 */
export const useVotingPower = ({
  address,
  blockNumber,
  useDummyData = false,
}: UseVotingPowerProps): UseVotingPowerData => {
  const [votingPower, setVotingPower] = useState<BigNumber>(BigNumber.from(0));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useDiamondSDKContext();

  const fetchVotingPower = async () => {
    if (!client || !address || !blockNumber) return;

    try {
      const governance = await client.pure.IGovernanceStructure();
      const repBalance = await governance?.walletVotingPower(
        address,
        blockNumber
      );
      setVotingPower(repBalance);
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
      setLoading(false);
    }
  };

  //** Set dummy data for development without querying SDK */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setVotingPower(BigNumber.from(0));
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (client) setLoading(true);
    fetchVotingPower();
  }, [client]);

  return {
    loading,
    error,
    votingPower,
    // Only allow refetching if not using dummy data
    refetch: () => (!useDummyData ? fetchVotingPower() : void 0),
  };
};
