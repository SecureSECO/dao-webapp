/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { getErrorMessage, promiseObjectAll } from '@/src/lib/utils';
import { DiamondGovernancePure } from '@plopmenz/diamond-governance-sdk';

export type UseFacetFetchProps<TFacet, TResult> = {
  facet: (client: DiamondGovernancePure) => Promise<TFacet>;
  data: (facet: TFacet) => Promise<TResult>;
  useAnonymousClient?: boolean;
};

export type UseFacetFetchData<TResult> = {
  data: TResult | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
};

export const useFacetFetch = <TFacet, TResult>(
  props: UseFacetFetchProps<TFacet, TResult>
): UseFacetFetchData<TResult> => {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { client: _client, anonClient } = useDiamondSDKContext();

  const client = props.useAnonymousClient ? anonClient : _client;

  const fetchData = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const facet = await props.facet(client.pure);
      const _data = await props.data(facet);
      setData(_data);
    } catch (e) {
      console.error('Error fetching from facet', e);
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [client]);

  return { data, error, loading, refetch: fetchData };
};

// The place to add hooks that are direct mappings of useFacetFetch

export const usePartialVotingProposalMinDuration = () =>
  useFacetFetch({
    facet: (c) => c.IPartialVotingProposalFacet(),
    // Attempts to convert min duration to number, if it fails, returns null
    data: (f) =>
      f
        .getMinDuration()
        .then((d) => d.toNumber())
        .catch(() => null),
    useAnonymousClient: true,
  });

export const useBurnVotingProposalCreationCost = () =>
  useFacetFetch({
    facet: (c) => c.IBurnVotingProposalFacet(),
    data: (f) => f.getProposalCreationCost(),
    useAnonymousClient: true,
  });

export const useTimeClaimable = () =>
  useFacetFetch({
    facet: (c) => c.IERC20TimeClaimableFacet(),
    data: (f) =>
      promiseObjectAll({
        amountClaimable: f.tokensClaimableTime(),
        claimPeriodMax: f.getClaimPeriodMax(),
        claimPeriodInterval: f.getClaimPeriodInterval(),
        claimReward: () => f.claimTime(),
      }),
  });
