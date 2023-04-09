import Logo from '@/src/components/Logo';
import Header from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';
import { format } from 'date-fns';
import {
  HiArrowRight,
  HiCalendar,
  HiCircleStack,
  HiCube,
  HiHome,
  HiInboxStack,
  HiUserGroup,
} from 'react-icons/hi2';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { useDao } from '@/src/hooks/useDao';
import { useProposals } from '@/src/hooks/useProposals';
import { useMembers } from '@/src/hooks/useMembers';
import { Button } from '@/src/components/ui/Button';
import { useDaoTransfers } from '@/src/hooks/useDaoTransfers';
import { ProposalCardList } from '@/src/pages/Governance';
import MembersList from '@/src/components/dashboard/MembersList';
import { DaoTransfers } from '@/src/pages/Finance';
import { Link } from '../components/ui/Link';

const Dashboard = () => {
  const { dao, loading: daoLoading, error: daoError } = useDao({});
  const { proposals: allProposals, loading: allProposalsLoading } =
    useProposals({});
  const {
    proposals,
    loading: proposalsLoading,
    error: proposalsError,
  } = useProposals({ limit: 5 });
  const {
    daoTransfers,
    loading: daoTransfersLoading,
    error: daoTransfersError,
  } = useDaoTransfers({});

  const {
    members,
    loading: membersLoading,
    error: membersError,
    memberCount,
  } = useMembers({ limit: 5 });

  // if (daoLoading) {
  //   return <Loader />;
  // }
  if (daoError) {
    console.log(daoError);

    return <p>error: {daoError}</p>;
  }

  return (
    <div className="grid grid-cols-7 gap-6">
      <Card
        loading={daoLoading}
        padding="lg"
        className="relative col-span-full flex shrink flex-row justify-between"
      >
        {dao && (
          <>
            <div className="flex flex-col justify-between gap-y-6">
              <div className="flex flex-col gap-y-2">
                <Header>{dao.name}</Header>
                <p className="text-xl font-semibold text-slate-500 dark:text-slate-400">
                  {dao.ensDomain}
                </p>
                <p className="text-base font-normal text-slate-500 dark:text-slate-400">
                  {dao.description}
                </p>
              </div>
              <div className="flex flex-col gap-x-6 gap-y-2 text-sm font-normal text-slate-500 dark:text-slate-400 lg:flex-row lg:items-center">
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
                  <p className="w-48 truncate xs:w-full">{dao.address}</p>
                </div>
              </div>
            </div>

            <div className="hidden flex-col items-end gap-y-6 sm:flex">
              <Logo className="h-28 w-28" />
              <div className="flex flex-col gap-y-2">
                {dao.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="text-end text-base font-medium text-primary-500 transition-colors duration-200 hover:text-primary dark:hover:text-primary-400"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      <MainCard
        className="col-span-full lg:col-span-4"
        loading={allProposalsLoading}
        icon={HiInboxStack}
        header={
          <DefaultMainCardHeader
            value={allProposals.length}
            label="proposals created"
          />
        }
        aside={
          <Button
            label="New proposal"
            onClick={() => console.log('New proposal click!')}
          />
        }
      >
        <ProposalCardList
          doubleColumn={false}
          proposals={proposals}
          loading={proposalsLoading}
          error={proposalsError}
        />
        <Link
          variant="outline"
          className="flex flex-row items-center gap-x-2"
          to="/governance"
          onClick={() => console.log('View all proposals click!')}
        >
          <p>View all proposals</p>
          <HiArrowRight className="h-5 w-5" />
        </Link>
      </MainCard>

      <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
        <MainCard
          className=""
          loading={daoTransfersLoading}
          icon={HiCircleStack}
          header={
            <DefaultMainCardHeader
              value={daoTransfers?.length ?? 0}
              label="transfers completed"
              truncateMobile
            />
          }
          aside={
            <Button
              label="New transfer"
              onClick={() => console.log('New transfer click!')}
            />
          }
        >
          {!daoTransfers ? (
            <p className="text-center font-normal">No transfers found!</p>
          ) : (
            <DaoTransfers daoTransfers={daoTransfers} limit={3} />
          )}
          <Link
            variant="outline"
            className="flex flex-row items-center gap-x-2"
            to="/finance"
          >
            <p>View all transfers</p>
            <HiArrowRight className="h-5 w-5" />
          </Link>
        </MainCard>

        <MainCard
          className=""
          loading={membersLoading}
          icon={HiUserGroup}
          header={<DefaultMainCardHeader value={memberCount} label="members" />}
          aside={
            <Button
              label="Add members"
              onClick={() => console.log('Add members click!')}
            />
          }
        >
          <MembersList
            members={members}
            loading={membersLoading}
            error={membersError}
          />
          <Link
            variant="outline"
            className="flex flex-row items-center gap-x-2"
            onClick={() => console.log('View all members click!')}
            to="/community"
          >
            <p>View all members</p>
            <HiArrowRight className="h-5 w-5" />
          </Link>
        </MainCard>
      </div>
    </div>
  );
};

export default Dashboard;
