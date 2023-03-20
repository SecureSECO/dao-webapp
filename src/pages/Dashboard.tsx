import Logo from '@/src/components/Logo';
import Header from '@/src/components/ui/Header';
import Loader from '@/src/components/ui/Loader';
import { Card } from '@/src/components/ui/Card';
import { format } from 'date-fns';
import {
  HiCalendar,
  HiCircleStack,
  HiCube,
  HiHome,
  HiInboxStack,
  HiUserGroup,
} from 'react-icons/hi2';
import { MainCard } from '@/src/components/ui/MainCard';
import { useDao } from '@/src/hooks/useDao';
import { useProposals } from '@/src/hooks/useProposals';
import { useEffect } from 'react';
import { useMembers } from '@/src/hooks/useMembers';

const Dashboard = () => {
  const { dao, loading: daoLoading, error: daoError } = useDao({});
  const {
    proposals,
    loading: proposalsLoading,
    error: proposalsError,
  } = useProposals({ useDummyData: false });

  const { members } = useMembers({});

  if (daoLoading) {
    return <Loader />;
  }
  if (daoError) {
    console.log(daoError);

    return <p>error: {daoError}</p>;
  }

  // TODO: add handling for loading and error states
  return dao ? (
    <div className="grid grid-cols-7 gap-6">
      <Card
        padding="lg"
        className="col-span-full flex shrink flex-row justify-between"
      >
        <div className="flex flex-col justify-between gap-y-6">
          <div className="flex flex-col gap-y-2">
            <Header>{dao.name}</Header>
            <p className="text-xl font-semibold text-slate-500 dark:text-slate-400">
              {dao.ensDomain}
            </p>
            <p className="text-lg font-normal text-slate-500 dark:text-slate-400">
              {dao.description}
            </p>
          </div>
          <div className="flex flex-row items-center gap-x-6 text-sm font-normal text-slate-500 dark:text-slate-400">
            <div className="flex flex-row items-center gap-x-1">
              <HiCalendar className="h-5 w-5 text-primary dark:text-primary-500" />
              <p>{format(dao.creationDate, 'MMMM yyyy')}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <HiCube className="h-5 w-5 text-primary dark:text-primary-500" />
              <p>{import.meta.env.DEV ? 'Goerli' : 'Polygon'}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <HiHome className="h-5 w-5 text-primary dark:text-primary-500" />
              <p>{dao.address}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-y-6">
          <Logo className="h-28 w-28" />
          <div className="flex flex-col gap-y-2">
            {dao.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="text-base font-medium text-primary-500 transition-colors duration-200 hover:text-primary dark:hover:text-primary-400"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </Card>

      <MainCard
        className="col-span-4"
        icon={HiInboxStack}
        header={
          <div className="flex flex-row items-end gap-x-2">
            <span className="text-3xl">5</span>
            <p>proposals created</p>
          </div>
        }
        btnLabel="New proposal"
        btnOnClick={(e) => console.log('Clicked!')}
      ></MainCard>

      <div className="col-span-3 flex flex-col gap-y-6">
        <MainCard
          className=""
          icon={HiCircleStack}
          header={
            <div className="flex flex-row items-end gap-x-2">
              <span className="text-3xl">$6.99</span>
              <p>treasury value</p>
            </div>
          }
          btnLabel="New transfer"
          btnOnClick={(e) => console.log('Clicked!')}
        ></MainCard>

        <MainCard
          className=""
          icon={HiUserGroup}
          header={
            <div className="flex flex-row items-end gap-x-2">
              <span className="text-3xl">2</span>
              <p>members</p>
            </div>
          }
          btnLabel="Add members"
          btnOnClick={(e) => console.log('Clicked!')}
        ></MainCard>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default Dashboard;
