/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useVerification } from '@/src/hooks/useVerification';
import { useWeb3Modal } from '@web3modal/react';
import { addDays } from 'date-fns';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Card, CardProps } from '@/src/components/ui/Card';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { toast } from '@/src/hooks/useToast';
import { Link } from '@/src/components/ui/Link';
import { Stamp } from '@plopmenz/diamond-governance-sdk';

export const MembershipStatus = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    chainId: PREFERRED_NETWORK_METADATA.id,
  });
  const { stamps, isVerified } = useVerification({
    useDummyData: false,
  });

  return (
    <MembershipStatusView
      isConnected={isConnected}
      chainId={chain?.id}
      openConnector={open}
      switchNetwork={switchNetwork}
      stamps={stamps}
      isVerified={isVerified}
    />
  );
};

/**
 * Conditionally renders a card about the mebership status showing a warning when applicable
 * @returns Either a Card component with a warning, or an empty fragment if no warning is needed
 */
export const MembershipStatusView = ({
  isConnected,
  chainId,
  openConnector,
  switchNetwork,
  stamps,
  isVerified,
}: {
  isConnected: boolean;
  chainId?: number;
  openConnector: (options?: any | undefined) => Promise<void>;
  switchNetwork?: (chainId_?: number) => void;
  stamps?: Stamp[];
  isVerified: (stamp: Stamp | null) => {
    verified: boolean;
    expired: boolean;
    preCondition: boolean;
    timeLeftUntilExpiration: number | null;
  };
}) => {
  // If user has not connected a wallet:
  // An informative banner, with button to connect wallet
  if (!isConnected)
    return (
      <MembershipCard message="Your wallet is not connected!">
        <Button
          variant="subtle"
          onClick={() => openConnector()}
          label="Connect Wallet"
        />
      </MembershipCard>
    );

  /**
   * Handles a click on the switch network button.
   * If the switchNetwork function is not defined (provider does not support this function), an error toast is shown.
   */
  const switchNetworkClick = () => {
    if (switchNetwork) switchNetwork();
    else
      toast({
        title: 'Could not switch network',
        description: 'Please switch network manually',
        variant: 'error',
      });
  };

  // If user has connected a wallet, but the wallet is not on the correct network:
  // An informative banner, showing a button to change network.
  if (chainId !== undefined && chainId !== PREFERRED_NETWORK_METADATA.id)
    return (
      <MembershipCard message="You are not on the correct network!">
        <Button
          variant="subtle"
          onClick={switchNetworkClick}
          label="Switch network"
        />
      </MembershipCard>
    );

  // If user has connected wallet but is not member:
  // An informative banner on how to become member, with button
  const isNotMember = !stamps || stamps.length === 0;
  if (isNotMember)
    return (
      <MembershipCard message="You are not yet a member of this DAO!">
        <Link to="/verification" variant="subtle">
          Become member
        </Link>
      </MembershipCard>
    );

  // Set boolean values needed for futher code
  let now = new Date();
  let expired = stamps.some((stamp) => isVerified(stamp).expired);
  let almostExpired =
    !expired &&
    stamps.some((stamp) => {
      const { timeLeftUntilExpiration } = isVerified(stamp);
      addDays(new Date(timeLeftUntilExpiration ?? 0), 30) >= now;
    });

  // If user has connected wallet but verification is about to expire:
  // A warning banner, with button to re-verify
  if (almostExpired)
    return (
      <MembershipCard message="Your verification is about to expire!">
        <Link to="/verification" variant="subtle">
          Reverify
        </Link>
      </MembershipCard>
    );

  // If user has connected wallet but verification is expired:
  // an important warning banner (red), with button to re-verify.
  if (expired)
    return (
      <MembershipCard message="Your verification has expired!">
        <Link to="/verification" variant="subtle">
          Reverify
        </Link>
      </MembershipCard>
    );

  // If membership Status is OK, don't show a banner
  return <></>;
};

interface MembershipCardProps extends CardProps {
  message: string;
}

/**
 * @param props.message Message to show in the card
 * @returns A Card component with an exclamation mark icon, a message, and the children on the right side
 */
export const MembershipCard = ({
  message,
  children,
  className,
  variant = 'warning',
  ...props
}: MembershipCardProps) => {
  return (
    <Card
      variant={variant}
      className={cn(
        'col-span-full flex flex-row items-center justify-between gap-x-1',
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-x-2">
        <HiOutlineExclamationCircle className="h-7 w-7 shrink-0" />
        <span className="text-lg">{message}</span>
      </div>
      {children}
    </Card>
  );
};
