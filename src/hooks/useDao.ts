import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { Client, DaoDetails as DaoApiData } from '@aragon/sdk-client';
import { useEffect, useState } from 'react';

export type DaoDetails = {
  name: string;
  address: string;
  ensDomain: string;
  description: string;
  links: { name: string; url: string }[];
  creationDate: Date;
} | null;

export interface UseDaoData {
  dao: DaoDetails;
  loading: boolean;
  error: boolean;
}

export type UseDaoProps = {
  useDummyData?: boolean;
};

export const useDao = ({ useDummyData = false }: UseDaoProps): UseDaoData => {
  const [daoDetails, setDaoDetails] = useState<DaoDetails>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { context } = useAragonSDKContext();

  const fetchDaoDetails = async (client: Client) => {
    if (!import.meta.env.VITE_DAO_ADDRESS) {
      setLoading(false);
      setError(true);
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
        });
        if (loading) setLoading(false);
        if (error) setError(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(true);
    }
  };

  //** Set dummy data for development without querying Aragon API */
  const setDummyData = () => {
    if (loading) setLoading(false);
    if (error) setError(false);

    setDaoDetails({
      name: 'SecureSECO Dummy DAO',
      address: '0x1234567890',
      ensDomain: 'dummy.dao.eth',
      description: 'This is dummy DAO data meant for development',
      links: [],
      creationDate: new Date(),
    });
  };

  useEffect(() => {
    if (useDummyData) return setDummyData();
    if (!context) return;
    const client = new Client(context);
    fetchDaoDetails(client);
  }, [context]);

  return {
    loading,
    error,
    dao: daoDetails,
  };
};
