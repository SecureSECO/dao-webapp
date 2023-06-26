/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import {
  getErrorMessage,
  promiseObjectAll,
  promiseWhenWithDefaultvalue,
} from '@/src/lib/utils';
import { DiamondGovernancePure } from '@plopmenz/diamond-governance-sdk';
import { BigNumber } from 'ethers';

/*
 * facet: Function to get the facet from the client
 * data: Function to get the data from the facet
 * context: optional data(=context) that will be passed to facet and data. Will refetch if context changes
 * useAnonymousClient: if true, the data will be fetched using the anonClient
 * */
export type UseFacetFetchProps<TFacet, TResult, TContext> = {
  facet: (client: DiamondGovernancePure, context?: TContext) => Promise<TFacet>;
  data: (facet: TFacet, context?: TContext) => Promise<TResult>;
  context?: TContext;
  useAnonymousClient?: boolean;
};

export type UseFacetFetchData<TResult> = {
  data: TResult | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
};

/*
 * Generic hook to retieve data from a DiamondSDK facet.
 * */
export const useFacetFetch = <TFacet, TResult, TContext>(
  props: UseFacetFetchProps<TFacet, TResult, TContext>
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
      const facet = await props.facet(client.pure, props.context);
      const _data = await props.data(facet, props.context);
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
  }, [client, props.context]);

  return { data, error, loading, refetch: fetchData };
};

// The place to add hooks that are simple usages of useFacetFetch

/**
 * Retrieves the minimum duration of a proposal in seconds
 * If the minimum duration is too large to be represented as a number, this will return null.
 */
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

/**
 * Retrieves the cost in rep to create a proposal.
 */
export const useBurnVotingProposalCreationCost = () =>
  useFacetFetch({
    facet: (c) => c.IBurnVotingProposalFacet(),
    data: (f) => f.getProposalCreationCost(),
    useAnonymousClient: true,
  });

/**
 * Retrieves data and methods from the IERC20TimeClaimableFacet (daily rewards)
 */
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

export const useTieredTimeClaimable = (tier: BigNumber | null) =>
  useFacetFetch({
    facet: (c) => c.IERC20TieredTimeClaimableFacet(),
    data: (f, context) =>
      promiseWhenWithDefaultvalue(
        context !== null && context !== undefined,
        () => f.getClaimReward(context!),
        null
      ),
    context: tier,
  });

export const usePoolBalance = () =>
  useFacetFetch({
    facet: (c) =>
      promiseObjectAll({
        mining: c.IMiningRewardPoolFacet(),
        verification: c.IVerificationRewardPoolFacet(),
      }),
    data: (f) =>
      promiseObjectAll({
        miningRewardPool: f.mining.getMiningRewardPool(),
        verificationRewardPool: f.verification.getVerificationRewardPool(),
      }),
    useAnonymousClient: true,
  });
