/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Verification, useVerification } from '@/src/hooks/useVerification';
import { useWeb3Modal } from '@web3modal/react';
import { addDays } from 'date-fns';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Card } from '../ui/Card';
import { Link as RouterLink } from 'react-router-dom';
import { Chain, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';

export const MembershipStatus = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { memberVerification } = useVerification({ useDummyData: true });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <MembershipStatusView
      isConnected={isConnected}
      verification={memberVerification}
      chainId={chain?.id}
      openConnector={open}
    />
  );
};

export const MembershipStatusView = ({
  isConnected,
  verification,
  chainId,
  openConnector,
  switchNetwork,
}: {
  isConnected: boolean;
  verification: Verification;
  chainId?: number;
  openConnector: (options?: any | undefined) => Promise<void>;
  switchNetwork?: (chainId_?: number) => void;
}) => {
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
          className="rounded-sm text-primary-highlight underline ring-ring ring-offset-2 ring-offset-destructive-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
          onClick={() => openConnector()}
        >
          Connect Wallet.
        </button>
      </Card>
    );
  }

  // If user has connected a wallet, but the wallet is not on the correct network:
  // An informative banner, showing a button to change network.

  if (chainId !== undefined && chainId !== PREFERRED_NETWORK_METADATA.id) {
    return (
      <Card
        variant="warning"
        className="col-span-full flex flex-row items-center gap-x-1"
      >
        <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
        Your wallet network is not correct{switchNetwork ? ':' : '.'}
        {switchNetwork ? (
          <button
            type="button"
            className="rounded-sm text-primary-highlight underline ring-ring ring-offset-2 ring-offset-destructive-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
            onClick={() => switchNetwork(PREFERRED_NETWORK_METADATA.id)}
          >
            Switch network.
          </button>
        ) : (
          <></>
        )}
      </Card>
    );
  }

  // If user has connected wallet but is not member:
  // An informative banner on how to become member, with button
  const isNotMember = verification === null || verification.length === 0;
  if (isNotMember) {
    return (
      <Card
        variant="warning"
        className="col-span-full flex flex-row items-center gap-x-1"
      >
        <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
        You are not yet a member of this DAO:
        <RouterLink
          to="/verification"
          className="rounded-sm text-primary-highlight underline ring-ring ring-offset-2 ring-offset-destructive-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
        >
          become a member!
        </RouterLink>
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
      <Card
        variant="warning"
        className="col-span-full flex flex-row items-center gap-x-1"
      >
        <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
        Your verification is almost expired:
        <RouterLink
          to="/verification"
          className="rounded-sm text-primary-highlight underline ring-ring ring-offset-2 ring-offset-destructive-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
        >
          re-verify
        </RouterLink>
      </Card>
    );
  }

  // If user has connected wallet but verification is expired:
  // an important warning banner (red), with button to re-verify.
  if (expired) {
    return (
      <Card
        variant="warning"
        className="col-span-full flex flex-row items-center gap-x-1"
      >
        <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
        Your verification is expired:
        <RouterLink
          to="/verification"
          className="rounded-sm text-primary-highlight underline ring-ring ring-offset-2 ring-offset-destructive-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
        >
          re-verify
        </RouterLink>
      </Card>
    );
  }

  // If membership Status is OK, don't show a banner
  return <></>;
};
