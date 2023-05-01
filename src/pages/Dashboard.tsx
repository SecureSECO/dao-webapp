/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Logo from '@/src/components/Logo';
import Header from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';
import { addDays, format } from 'date-fns';
import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiCalendar,
  HiCircleStack,
  HiCube,
  HiHome,
  HiInboxStack,
  HiOutlineExclamationCircle,
  HiUserGroup,
  HiXMark,
} from 'react-icons/hi2';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { useDao } from '@/src/hooks/useDao';
import { useProposals } from '@/src/hooks/useProposals';
import { useMembers } from '@/src/hooks/useMembers';
import { useDaoTransfers } from '@/src/hooks/useDaoTransfers';
import { ProposalCardList } from '@/src/pages/Governance';
import MembersList from '@/src/components/dashboard/MembersList';
import { DaoTransfersList } from '@/src/pages/Finance';
import { Link } from '@/src/components/ui/Link';
import { getSupportedNetworkByChainId } from '@/src/lib/constants/chains';
import { getChainDataByChainId } from '@/src/lib/constants/chains';
import { useAccount } from 'wagmi';
import { useVerification, Verification } from '../hooks/useVerification';
import ConnectButton from '../components/layout/ConnectButton';
import { useWeb3Modal } from '@web3modal/react';

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
      {/* TODO: Hidde will make a nice banner styling */}
      <MembershipStatus
        isConnected={isConnected}
        verification={memberVerification}
      />

      {/* Card showing metadata about the DAO */}
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
                    className="flex flex-row items-center gap-x-2 font-medium text-primary-highlight transition-colors duration-200 hover:text-primary-highlight/80"
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
          className=""
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

const MembershipStatus = ({
  isConnected,
  verification,
}: {
  isConnected: Boolean;
  verification: Verification;
}) => {
  const { open } = useWeb3Modal();
  // If user has not connected a wallet:
  // An informative banner, with button to connect wallet
  if (!isConnected) {
    return (
      <Card
        variant="warning"
        className="col-span-full flex flex-row items-center gap-x-1"
      >
        <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
        Your wallet is not yet connected:
        <button
          type="button"
          className="text-primary-highlight underline transition-colors duration-200 hover:text-primary-highlight/80"
          onClick={() => open()}
        >
          Connect Wallet.
        </button>
      </Card>
    );
  }

  // If user has connected wallet but is not member:
  // An informative banner on how to become member, with button
  const isNotMember = verification === null || verification.length === 0;
  if (isNotMember) {
    return (
      <Card className="col-span-full">
        Oh no, you are not a member of the DAO.
      </Card>
    );
  }

  // Set boolean values needed for futher code
  let now = new Date();
  let expired = verification.some((stamp) => stamp.expiration >= now);
  let almostExpired =
    !expired &&
    verification.some((stamp) => addDays(stamp.expiration, 30) >= now);

  // If user has connected wallet but verification is about to expire:
  // A warning banner, with button to re-verify
  if (almostExpired) {
    return (
      <Card className="col-span-full">
        Oh no, your verification is almost expired!
      </Card>
    );
  }

  // If user has connected wallet but verification is expired:
  // an important warning banner (red), with button to re-verify.
  if (expired) {
    return (
      <Card className="col-span-full">
        Oh no, your verification is expired!
      </Card>
    );
  }

  // If membership Status is OK, don't show a banner
  return <></>;
};

export default Dashboard;
