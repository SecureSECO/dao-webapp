/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Verification } from '@/src/hooks/useVerification';
import { useWeb3Modal } from '@web3modal/react';
import { addDays } from 'date-fns';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Card } from '../ui/Card';
import { Link as RouterLink } from 'react-router-dom';

export const MembershipStatus = ({
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
          className="rounded-sm text-primary-highlight underline ring-ring ring-offset-2 ring-offset-destructive-background transition-colors duration-200 hover:text-primary-highlight/80 focus:outline-none focus:ring-1"
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
