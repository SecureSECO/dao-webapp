/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { useEffect, useState } from 'react';

type VotingSettings = {
  minDuration: number;
};

export type UseVotingSettingsData = {
  loading: boolean;
  error: string | null;
  settings: VotingSettings | null;
};

export type UseVotingSettingsProps = {
  useDummyData?: boolean;
};

const dummyVotingSettings: VotingSettings = {
  minDuration: 86400,
  // Below are currently not being fetched, but can be fetched from the SDK
  // minParticipation: 0.15,
  // minProposerVotingPower: 1000000000000000000n,
  // supportThreshold: 0.5,
  // votingMode: VotingMode.EARLY_EXECUTION,
};

/**
 * Retrieves voting settings from SDK
 * @param useDummyData Whether to use dummy data for development
 * @returns plugin governance settings
 */
export const useVotingSettings = ({
  useDummyData = false,
}: UseVotingSettingsProps): UseVotingSettingsData => {
  const [data, setData] = useState<VotingSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { client } = useDiamondSDKContext();

  const fetchVotingSettings = async () => {
    if (!client) return;

    try {
      const proposalFacet = await client?.pure.IPartialVotingProposalFacet();
      const minDurationData = await proposalFacet.minDuration();
      setLoading(false);
      setData({ minDuration: minDurationData.toNumber() });
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
      setLoading(false);
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setData(dummyVotingSettings);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (client) setLoading(true);
    fetchVotingSettings();
  }, [client]);

  return { settings: data, error, loading };
};
