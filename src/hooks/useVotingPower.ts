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

export type UseVotingPowerData = {
  loading: boolean;
  error: string | null;
  // Voting power of given wallet
  votingPower: BigNumber;
  // Minimum voting power required to create a proposal
  minProposalVotingPower: BigNumber;
  getVotingPower: () => Promise<BigNumber>;
  refetch: () => void;
};

export type UseVotingPowerProps = {
  address: string | undefined;
  useDummyData?: boolean;
};

/**
 * Hook to fetch the voting power (rep balance) of a given wallet
 * @param props.address Address of the wallet to fetch the voting power of
 * @returns Object containing the votingPower and a refetch function, as well as loading and error states
 */
export const useVotingPower = ({
  address,
  useDummyData = false,
}: UseVotingPowerProps): UseVotingPowerData => {
  const [votingPower, setVotingPower] = useState<BigNumber>(BigNumber.from(0));
  const [minProposalVotingPower, setMinProposalVotingPower] =
    useState<BigNumber>(BigNumber.from(0));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useDiamondSDKContext();

  /**
   * Fetches the voting power of an address through the Diamond Governance SDK
   * @returns Voting power of given wallet address
   */
  const getVotingPower = async (): Promise<BigNumber> => {
    if (!client || !address) throw new Error('Client or address not set');

    const governance = await client.pure.IERC20();
    const repBalance = await governance.balanceOf(address);
    console.log('repBalance', repBalance);

    return repBalance;
  };

  // Update state variable for voting power
  const updateVotingPower = async () => {
    if (!client || !address) return;

    try {
      const repBalance = await getVotingPower();
      setVotingPower(repBalance);
    } catch (e) {
      console.error('Error fetching voting power', e);
      setError(getErrorMessage(e));
      setLoading(false);
    }
  };

  // Update state variable for minimum voting power required to create a proposal
  const updateMinProposalVotingPower = async () => {
    if (!client) return;

    try {
      const partialVoting = await client.pure.IPartialVotingProposalFacet();
      const minVotingPowerData = await partialVoting.minProposerVotingPower();
      setMinProposalVotingPower(minVotingPowerData);
    } catch (e) {
      console.error('Error fetching min proposal voting power', e);
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
    updateVotingPower();
    updateMinProposalVotingPower();
    const id = setInterval(() => updateVotingPower(), 10000);
    return () => clearInterval(id);
  }, [client]);

  return {
    loading,
    error,
    votingPower,
    minProposalVotingPower,
    getVotingPower,
    // Only allow refetching if not using dummy data
    refetch: () => (!useDummyData ? updateVotingPower() : void 0),
  };
};
