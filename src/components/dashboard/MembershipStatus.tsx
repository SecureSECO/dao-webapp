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
import { Card, CardProps } from '@/src/components/ui/Card';
import { Chain, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { toast } from '@/src/hooks/useToast';
import { Link } from '@/src/components/ui/Link';
import { useEffect } from 'react';

export const MembershipStatus = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { memberVerification } = useVerification({ useDummyData: true });
  const { chain } = useNetwork();
  const { switchNetworkAsync, isLoading } = useSwitchNetwork({
    chainId: PREFERRED_NETWORK_METADATA.id,
  });

  useEffect(() => {
    console.log(status);
  }, [status]);

  return (
    <MembershipStatusView
      isConnected={isConnected}
      verification={memberVerification}
      chainId={chain?.id}
      openConnector={open}
      switchNetwork={switchNetworkAsync}
      switchInProgress={isLoading}
    />
  );
};

/**
 * Conditionally renders a card about the mebership status showing a warning when applicable
 * @returns Either a Card component with a warning, or an empty fragment if no warning is needed
 */
export const MembershipStatusView = ({
  isConnected,
  verification,
  chainId,
  openConnector,
  switchNetwork,
  switchInProgress,
}: {
  isConnected: boolean;
  verification: Verification;
  chainId?: number;
  openConnector: (options?: any | undefined) => Promise<void>;
  switchNetwork?:
    | ((chainId_?: number | undefined) => Promise<Chain>)
    | undefined;
  switchInProgress: boolean;
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
  const switchNetworkClick = async () => {
    if (switchInProgress)
      return toast({
        title: 'Switch network already in progress',
        description: 'Complete the current request in your wallet provider',
      });
    if (switchNetwork) {
      try {
        await switchNetwork();
      } catch (e: any) {
        toast({
          title: 'Could not switch network',
          description: 'Error switching chain',
          variant: 'error',
        });
      }
    } else
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
      <MembershipCard message="You are on the incorrect network!">
        <Button
          variant="subtle"
          onClick={switchNetworkClick}
          label="Switch network"
        />
      </MembershipCard>
    );

  // If user has connected wallet but is not member:
  // An informative banner on how to become member, with button
  const isNotMember = verification === null || verification.length === 0;
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
  let expired = verification.some((stamp) => stamp.expiration >= now);
  let almostExpired =
    !expired &&
    verification.some((stamp) => addDays(stamp.expiration, 30) >= now);

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
