/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { getErrorMessage } from '@/src/lib/utils';
import { Client, DaoDetails as DaoApiData } from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

export type DaoDetails = {
  name: string;
  address: string;
  ensDomain: string;
  description: string;
  links: { name: string; url: string }[];
  creationDate: Date;
  plugins: { id: string; instanceAddress: string }[];
} | null;

export type UseDaoData = {
  dao: DaoDetails;
  loading: boolean;
  error: string | null;
};

export type UseDaoProps = {
  useDummyData?: boolean;
};

export const useDao = ({ useDummyData = false }: UseDaoProps): UseDaoData => {
  const [daoDetails, setDaoDetails] = useState<DaoDetails>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useAragonSDKContext();

  const fetchDaoDetails = async (client: Client) => {
    if (!import.meta.env.VITE_DAO_ADDRESS) {
      setLoading(false);
      setError("DAO address env variable isn't set");
      return;
    }

    try {
      const dao: DaoApiData | null = await client.methods.getDao(
        import.meta.env.VITE_DAO_ADDRESS
      );
      if (dao) {
        setDaoDetails({
          name: dao.metadata.name,
          address: dao.address,
          ensDomain: dao.ensDomain,
          description: dao.metadata.description,
          links: dao.metadata.links,
          creationDate: dao.creationDate,
          plugins: dao.plugins,
        });

        setLoading(false);
        setError(null);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(getErrorMessage(e));
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    setLoading(false);
    setError(null);

    setDaoDetails({
      name: 'SecureSECO Dummy DAO',
      address: '0x1234567890',
      ensDomain: 'dummy.dao.eth',
      description: 'This is dummy DAO data meant for development',
      links: [],
      creationDate: new Date(),
      plugins: [],
    });
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!client) return;
    fetchDaoDetails(client);
  }, [client]);

  return {
    loading,
    error,
    dao: daoDetails,
  };
};
