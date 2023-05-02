/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/src/lib/utils';

type UseSearchSECOProps = {
  searchUrl: string;
  token: string;
};

type UseSearchSECOData = {
  loading: boolean;
  error: string | null;
  result: any;
};

export const useSearchSECO = ({
  searchUrl,
  token,
}: UseSearchSECOProps): UseSearchSECOData => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const fetchSearchSECO = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: searchUrl,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
      setLoading(false);
      setError(null);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    if (!searchUrl || !token) return;
    fetchSearchSECO();
  }, [searchUrl, token]);

  return {
    loading,
    error,
    result,
  };
};