/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import { getErrorMessage } from '../lib/utils';

/*
 * Hook to retrieve the current tier of the user.
 * It is possible for member to belong to different tiers, this hook retrieves the Tier of the member.
 * */
export const useTier = () => {
  const { address } = useAccount();
  const [tier, setTier] = useState<BigNumber | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { client } = useDiamondSDKContext();

  const now = Math.round(new Date().getTime() / 1000);

  const fetchTier = async () => {
    if (!client || !address) return;
    setLoading(true);

    try {
      const facet = await client.pure.ITieredMembershipStructure();
      const tier = await facet.getTierAt(address, now);
      setTier(tier);
    } catch (e) {
      console.error('Error fetching from facet', e);
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTier();
  }, [client, address]);

  return { tier, error, loading, refetch: fetchTier };
};
