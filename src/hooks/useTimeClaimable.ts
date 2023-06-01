/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { BigNumber, ContractTransaction } from 'ethers';

import { useDiamondSDKContext } from '../context/DiamondGovernanceSDK';
import { getErrorMessage } from '../lib/utils';

export type UseTimeClaimableProps = {
  useDummyData?: boolean;
};

export type UseTimeClaimableData = {
  loading: boolean;
  error: string | null;
  amountClaimable: BigNumber | null;
  claimReward: () => Promise<ContractTransaction>;
  refetch: () => void;
};

export const useTimeClaimable = ({
  useDummyData = false,
}: UseTimeClaimableProps): UseTimeClaimableData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [amountClaimable, setAmountClaimable] = useState<BigNumber | null>(
    null
  );
  const { client } = useDiamondSDKContext();

  //** Set dummy data for development without querying SDK */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setAmountClaimable(BigNumber.from(123456));
  };

  const updateAmountClaimable = async () => {
    if (!client) return;

    try {
      const facet = await client.pure.IERC20TimeClaimableFacet();
      const claimable = await facet.tokensClaimableTime();
      setAmountClaimable(claimable);
      setLoading(false);
    } catch (e) {
      console.error('Error fetching claimaible tokens', e);
      setError(getErrorMessage(e));
      setLoading(false);
      return null;
    }
  };

  const claimReward = async () => {
    if (!client) throw new Error('Diamond SDK client not set.');
    const facet = await client.pure.IERC20TimeClaimableFacet();
    return await facet.claimTime();
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    updateAmountClaimable();
  }, [client]);

  return {
    loading,
    error,
    claimReward,
    amountClaimable,
    refetch: () => (useDummyData ? void 0 : updateAmountClaimable()),
  };
};
