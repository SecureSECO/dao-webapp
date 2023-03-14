import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { Client, DaoDetails } from '@aragon/sdk-client';
import { useEffect } from 'react';

const Dashboard = () => {
  const { context } = useAragonSDKContext();

  const fetchDao = async (client: Client) => {
    if (!import.meta.env.VITE_DAO_ADDRESS) return;
    const dao: DaoDetails | null = await client.methods.getDao(
      '0xa23ff5fc643b1a8d5866f5b392dc5924b746c6fd'
    );
    console.log(dao);
  };

  useEffect(() => {
    if (!context) return;
    const client = new Client(context);
    fetchDao(client);
  }, [context]);

  return (
    <div className="h-full w-full">
      <p className="h-[10000px]">Test</p>
    </div>
  );
};

export default Dashboard;
