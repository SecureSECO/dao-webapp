/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useAccount, useBlockNumber } from 'wagmi';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import { getErrorMessage } from '../lib/utils';

const useTier = () => {
  const { address } = useAccount();
  const { data: blockNumber, error: blockNumberError } = useBlockNumber();
  const [tier, setTier] = useState<BigNumber | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { client } = useDiamondSDKContext();

  const fetchTier = async () => {
    if (!client || !address || !blockNumber) return;
    setLoading(true);

    try {
      const facet = await client.pure.ITieredMembershipStructure();
      const tier = await facet.getTierAt(address, blockNumber);
      setTier(tier);
    } catch (e) {
      console.error('Error fetching from facet', e);
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blockNumberError) {
      setError(getErrorMessage(blockNumberError));
      setLoading(false);
    } else {
      fetchTier();
    }
  }, [client, address, blockNumber, blockNumberError]);

  return { tier, error, loading, refetch: fetchTier };
};
