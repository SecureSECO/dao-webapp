/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Logo from '@/src/components/Logo';
import { ClaimDailyRewardCard } from '@/src/components/dashboard/ClaimDailyRewardCard';
import MembersList from '@/src/components/dashboard/MembersList';
import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { Link } from '@/src/components/ui/Link';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useDaoTransfers } from '@/src/hooks/useDaoTransfers';
import { useMembers } from '@/src/hooks/useMembers';
import { useProposals } from '@/src/hooks/useProposals';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { CONFIG, DAO_METADATA } from '@/src/lib/constants/config';
import { DaoTransfersList, NewTransferDropdown } from '@/src/pages/Finance';
import { ProposalCardList } from '@/src/pages/Governance';
import {
  HiArrowRight,
  HiArrowTopRightOnSquare,
  HiCircleStack,
  HiCube,
  HiHome,
  HiInboxStack,
  HiUserGroup,
} from 'react-icons/hi2';
import { useAccount } from 'wagmi';

const Dashboard = () => {
  const { isConnected } = useAccount();
  const { daoAddress } = useDiamondSDKContext();
  // UseProposals is passed the default parameters, to ensure switching between pages will not use params from Governange page
  const {
    proposals,
    proposalCount,
    loading: proposalsLoading,
    error: proposalsError,
    countLoading,
  } = useProposals({
    limit: 5,
    status: undefined,
    fromIndex: 0,
    order: undefined,
    sorting: undefined,
  });
  const {
    daoTransfers,
    loading: daoTransfersLoading,
    error: daoTransfersError,
  } = useDaoTransfers();
  const {
    members,
    loading: membersLoading,
    error: membersError,
    memberCount,
  } = useMembers({ limit: 5 });

  const etherscanURL = PREFERRED_NETWORK_METADATA.explorer;

  return (
    <div className="grid grid-cols-7 gap-6">
      {/* Card showing metadata about the DAO */}
      <Card
        size="lg"
        className="relative col-span-full flex shrink flex-col gap-y-6 sm:flex-row justify-between"
      >
        <div className="flex flex-col justify-between gap-y-6">
          <div className="space-y-8">
            <Header>{DAO_METADATA.name}</Header>
            <p className="text-lg font-normal text-highlight-foreground/80">
              {DAO_METADATA.description}
            </p>
          </div>
          <div className="flex flex-col gap-x-6 gap-y-2 text-sm font-normal text-highlight-foreground/80 lg:flex-row lg:items-center">
            <div className="flex flex-row items-center gap-x-1">
              <HiCube className="h-5 w-5 shrink-0 text-primary" />
              <p>{import.meta.env.DEV ? 'Mumbai' : 'Polygon'}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <HiHome className="h-5 w-5 shrink-0 text-primary" />
              <Address address={daoAddress ?? '...'} showCopy />
            </div>
          </div>
        </div>

        <div className="flex-col sm:items-end gap-y-6 flex">
          <Logo className="h-28 w-28 hidden sm:block" />
          <div className="flex flex-col items-end">
            {DAO_METADATA.links.map((link, i) => (
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
      </Card>

      <MainCard
        className="col-span-full lg:col-span-4"
        loading={countLoading}
        icon={HiInboxStack}
        header={
          <DefaultMainCardHeader
            value={proposalCount}
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
        >
          <p>View all proposals</p>
          <HiArrowRight className="h-5 w-5" />
        </Link>
      </MainCard>

      {/* div containing the right column of the dashboard */}
      <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
        {/* Card containing the option to claim daily rewards*/}
        {isConnected && <ClaimDailyRewardCard />}

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
          aside={<NewTransferDropdown />}
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
            to={`${etherscanURL}/token/tokenholderchart/${CONFIG.DIAMOND_ADDRESS}`}
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
