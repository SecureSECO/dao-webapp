/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { addDays } from 'date-fns';

export type Verification = null | Stamp[];
export type Stamp = {
  expiration: Date;
};

//NOTE: This is a just a dummy implementation!
export const useVerification = ({ useDummyData = false }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [memberVerification, setMemberVerification] =
    useState<Verification>(null);

  const fetchVerification = async (client: any) => {
    console.error('Fetching of verification is not yet implemented');
  };

  const setDummyData = () => {
    setLoading(false);
    setError(null);
    const now = new Date();

    const stamps = [
      addDays(now, 60), //very much expired
      addDays(now, 15), // 15 days expired
      addDays(now, -15), // almost expired
      addDays(now, -60), // good to go
    ].map((x) => ({ expiration: x }));

    setMemberVerification(stamps);
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    fetchVerification(true);
  }, []);

  return {
    loading,
    error,
    memberVerification,
  };
};
