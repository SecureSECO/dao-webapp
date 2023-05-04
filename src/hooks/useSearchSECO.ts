/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { promise } from '@/src/hooks/useToast';
import { getErrorMessage } from '@/src/lib/utils';
import { useState } from 'react';

type QueryResponse = any;

type UseSearchSECOProps = {};

type UseSearchSECOData = {
  queryResult: QueryResponse;
  runQuery: (url: string, token: string) => void;
};

/**
 * Utility functions to interact with the SearchSECO database and API
 * @returns Functions and results of interacting with the SearchSECO database and API
 */
export const useSearchSECO = (props: UseSearchSECOProps): UseSearchSECOData => {
  const [queryResult, setQueryResult] = useState<QueryResponse | null>(null);

  const fetchResult = async (
    url: string,
    token: string
  ): Promise<QueryResponse> =>
    new Promise((resolve, reject) => {
      return fetch('http://localhost:8080/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          token,
        }),
      })
        .then((response) => {
          if (!response.ok)
            reject(`API request failed with status ${response.status}`);
          return response.json();
        })
        .then((res) => {
          setQueryResult(res);
          resolve(res);
        })
        .catch((e) => {
          console.error(e);
          reject(getErrorMessage(e));
        });
    });

  const runQuery = async (url: string, token: string) => {
    promise(fetchResult(url, token), {
      loading: 'Querying SearchSECO database...',
      success: 'Query successful!',
      error: (err) => ({
        title: err,
        description: '',
      }),
    });
  };

  return {
    queryResult,
    runQuery,
  };
};
