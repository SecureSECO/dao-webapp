/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MembersList from '@/src/components/dashboard/MembersList';
import Logo from '@/src/components/Logo';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { useDao } from '@/src/hooks/useDao';
import { useDaoTransfers } from '@/src/hooks/useDaoTransfers';
import { useMembers } from '@/src/hooks/useMembers';
import { useProposals } from '@/src/hooks/useProposals';
import {
  getChainDataByChainId,
  getSupportedNetworkByChainId,
} from '@/src/lib/constants/chains';
import { DaoTransfersList } from '@/src/pages/Finance';
import { ProposalCardList } from '@/src/pages/Governance';
import { format } from 'date-fns';
import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiCalendar,
  HiCircleStack,
  HiCube,
  HiHome,
  HiInboxStack,
  HiUserGroup,
} from 'react-icons/hi2';
import { useAccount } from 'wagmi';
import { MembershipStatus } from '../components/dashboard/MembershipStatus';
import { useVerification } from '../hooks/useVerification';

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

  const { isConnected } = useAccount();
  const { memberVerification } = useVerification({ useDummyData: true });

  if (daoError) {
    console.log(daoError);

    return <p>error: {daoError}</p>;
  }

  const chainId = import.meta.env.VITE_PREFERRED_NETWORK_ID;
  const currentNetwork = getSupportedNetworkByChainId(+chainId);
  const etherscanURL = getChainDataByChainId(+chainId)?.explorer;

  return (
    <div className="grid grid-cols-7 gap-6">
      {/* Banner on top showing optional information about membership status */}
      <MembershipStatus
        isConnected={isConnected}
        verification={memberVerification}
      />

      {/* Card showing metadata about the DAO */}
      <Card
        loading={daoLoading}
        size="lg"
        className="relative col-span-full flex shrink flex-row justify-between"
      >
        {dao && (
          <>
            <div className="flex flex-col justify-between gap-y-6">
              <div className="flex flex-col gap-y-2">
                <Header>{dao.name}</Header>
                <p className="text-xl font-semibold text-highlight-foreground/80">
                  {dao.ensDomain}
                </p>
                <p className="text-base font-normal text-highlight-foreground/80">
                  {dao.description}
                </p>
              </div>
              <div className="flex flex-col gap-x-6 gap-y-2 text-sm font-normal text-highlight-foreground/80 lg:flex-row lg:items-center">
                <div className="flex flex-row items-center gap-x-1">
                  <HiCalendar className="h-5 w-5 shrink-0 text-primary" />
                  <p>{format(dao.creationDate, 'MMMM yyyy')}</p>
                </div>
                <div className="flex flex-row items-center gap-x-1">
                  <HiCube className="h-5 w-5 shrink-0 text-primary" />
                  <p>{import.meta.env.DEV ? 'Goerli' : 'Polygon'}</p>
                </div>
                <div className="flex flex-row items-center gap-x-1">
                  <HiHome className="h-5 w-5 shrink-0 text-primary" />
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
                    className="flex flex-row items-center gap-x-2 rounded-sm font-medium text-primary-highlight ring-ring ring-offset-2 ring-offset-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
                  >
                    {link.name}
                    <HiArrowTopRightOnSquare className="h-4 w-4 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Proposal Card */}
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
        aside={<Link label="New proposal" to="/governance/new-proposal" />}
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

      {/* div containing the right column of the dashboard */}
      <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
        {/* Card containing the latest dao transfers */}
        <MainCard
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
            <Link
              label="New transfer"
              target="_blank"
              rel="noreferrer"
              to={`https://app.aragon.org/#/daos/${currentNetwork}/${dao?.address}/finance/new-deposit`}
            />
          }
        >
          <DaoTransfersList
            daoTransfers={daoTransfers}
            limit={3}
            loading={daoTransfersLoading}
            error={daoTransfersError}
          />
          <Link
            variant="outline"
            className="flex flex-row items-center gap-x-2"
            to="/finance"
          >
            <p>View all transfers</p>
            <HiArrowRight className="h-5 w-5 shrink-0" />
          </Link>
        </MainCard>

        {/* Card containing DAO members */}
        <MainCard
          loading={membersLoading}
          icon={HiUserGroup}
          header={<DefaultMainCardHeader value={memberCount} label="members" />}
          aside={<Link label="Add members" to="/governance/new-proposal" />}
        >
          <MembersList
            members={members}
            loading={membersLoading}
            error={membersError}
          />
          <Link
            variant="outline"
            className="flex flex-row items-center gap-x-2"
            target="_blank"
            rel="noreferrer"
            to={`${etherscanURL}/token/tokenholderchart/${
              import.meta.env.VITE_REP_CONTRACT
            }`}
          >
            <p>View all members</p>
            <HiArrowRight className="h-5 w-5 shrink-0" />
          </Link>
        </MainCard>
      </div>
    </div>
  );
};

export default Dashboard;
