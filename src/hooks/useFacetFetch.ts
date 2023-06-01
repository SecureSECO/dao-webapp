/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { DiamondGovernancePure } from '@plopmenz/diamond-governance-sdk';

export type UseFacetFetchProps<TFacet, TResult> = {
  facet: (client: DiamondGovernancePure) => Promise<TFacet>;
  data: (facet: TFacet) => Promise<TResult>;
};

export type UseFacetFetchData<TResult> = {
  data: TResult | null;
  error: string | null;
  loading: boolean;
};

export const useFacetFetch = <TFacet, TResult>(
  props: UseFacetFetchProps<TFacet, TResult>
): UseFacetFetchData<TResult> => {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { client } = useDiamondSDKContext();

  const fetchData = async () => {
    if (!client) return;

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
    if (client) setLoading(true);
    fetchData();
  }, [client]);

  return { data, error, loading };
};

export const usePartialVotingProposalMinDuration = () =>
  useFacetFetch({
    facet: (c) => c.IPartialVotingProposalFacet(),
    data: (f) => f.getMinDuration(),
  });
