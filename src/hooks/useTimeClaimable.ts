/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { IERC20TimeClaimableFacet } from '@plopmenz/diamond-governance-sdk';
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

  let facet: IERC20TimeClaimableFacet | null = null;

  //** Set dummy data for development without querying SDK */
  const setDummyData = () => {
    setLoading(false);
    setError(null);
    setAmountClaimable(BigNumber.from(123456));
  };

  const initFacet = async () => {
    if (!client) return;
    if (facet) return;

    try {
      const _facet = await client.pure.IERC20TimeClaimableFacet();
      facet = _facet;
    } catch (e) {
      console.error('Error fetching TimeClaimableFacet', e);
      setError(getErrorMessage(e));
      setLoading(false);
    }
  };

  const updateAmountClaimable = async () => {
    if (!facet) return;
    const claimable = await facet.tokensClaimableTime();
    setAmountClaimable(claimable);
  };

  const claimReward = () => {
    if (!client || !facet) throw new Error('Client or facet are not defined.');
    return facet.claimTime();
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    initFacet();
    updateAmountClaimable();
    if (facet) setLoading(false);
  }, [client]);

  return {
    loading,
    error,
    claimReward,
    amountClaimable,
  };
};
