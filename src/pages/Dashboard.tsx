import Logo from '@/src/components/Logo';
import Header from '@/src/components/ui/Header';
import Loader from '@/src/components/ui/Loader';
import { Panel } from '@/src/components/ui/Panel';
import { useAragonSDKContext } from '@/src/context/AragonSDK';
import { Client, DaoDetails } from '@aragon/sdk-client';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { HiCalendar, HiCube, HiHome } from 'react-icons/hi2';

type DaoInfo = {
  name: string;
  address: string;
  ensDomain: string;
  description: string;
  links: { name: string; url: string }[];
  creationDate: Date;
} | null;

const Dashboard = () => {
  const [daoDetails, setDaoDetails] = useState<DaoInfo>(null);
  const { context } = useAragonSDKContext();

  const fetchDaoDetails = async (client: Client) => {
    if (!import.meta.env.VITE_DAO_ADDRESS) return;
    const dao: DaoDetails | null = await client.methods.getDao(
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
    }
  };

  useEffect(() => {
    if (!context) return;
    const client = new Client(context);
    fetchDaoDetails(client);
  }, [context]);

  return daoDetails ? (
    <div className="grid grid-cols-3 gap-4">
      <Panel padding="lg" className="col-span-3 flex flex-row justify-between">
        <div className="flex flex-col justify-between gap-y-6">
          <div className="flex flex-col gap-y-2">
            <Header>{daoDetails.name}</Header>
            <p className="text-xl font-semibold text-slate-500 dark:text-slate-400">
              {daoDetails.ensDomain}
            </p>
            <p className="text-lg font-normal text-slate-500 dark:text-slate-400">
              {daoDetails.description}
            </p>
          </div>
          <div className="flex flex-row items-center gap-x-6 text-sm font-normal text-slate-500 dark:text-slate-400">
            <div className="flex flex-row items-center gap-x-1">
              <HiCalendar className="h-5 w-5 text-primary" />
              <p>{format(daoDetails.creationDate, 'MMMM yyyy')}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <HiCube className="h-5 w-5 text-primary" />
              <p>{import.meta.env.DEV ? 'Goerli' : 'Polygon'}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <HiHome className="h-5 w-5 text-primary" />
              <p>{daoDetails.address}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-y-6">
          <Logo className="h-28 w-28" />
          <div className="flex flex-col gap-y-2">
            {daoDetails.links.map((link) => (
              <a
                href={link.url}
                className="text-base font-medium text-primary-500 transition-colors duration-200 hover:text-primary dark:hover:text-primary-400"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  ) : (
    // TODO: show loading state
    <Loader />
  );
};

export default Dashboard;
