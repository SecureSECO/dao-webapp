/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/Dropdown';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { cn } from '@/src/lib/utils';
import { useAppKit } from '@reown/appkit/react';
import { FaWallet } from 'react-icons/fa';
import { HiExclamationCircle, HiOutlineLogout } from 'react-icons/hi';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useAccount, useChainId, useDisconnect, useSwitchChain } from 'wagmi';

const ConnectButton = ({ buttonClassName }: { buttonClassName?: string }) => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { address } = useAccount();
  const chainId = useChainId();

  // Make sure the user is on the correct network
  const [attemptedSwitch, setAttemptedSwitch] = useState(false);
  const { switchChainAsync, isPending: isLoading } = useSwitchChain({});

  useEffect(() => {
    const handleSwitchNetwork = async () => {
      if (
        !attemptedSwitch &&
        !isLoading &&
        chainId !== PREFERRED_NETWORK_METADATA.id &&
        switchChainAsync
      ) {
        try {
          await switchChainAsync({ chainId: PREFERRED_NETWORK_METADATA.id });
        } catch (e) {
          // Unable to switch network (possibly because it's already in progress since another render)
          console.error(e);
          setAttemptedSwitch(true);
        }
      }
    };

    handleSwitchNetwork();
  }, [chainId, switchChainAsync, isLoading]);

  let jazznumber = address ? jsNumberForAddress(address!) : 0;

  return address ? (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex rounded-full text-sm focus:outline-none ring-ring ring-offset-2 ring-offset-background focus:ring-2">
          <span className="sr-only">Open wallet menu</span>
          <Jazzicon diameter={40} seed={jazznumber} />
          {chainId !== PREFERRED_NETWORK_METADATA.id && (
            <Tooltip>
              <TooltipTrigger asChild className="absolute -right-2 -top-2">
                <div>
                  <HiExclamationCircle className="text-xl text-primary drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Incorrect Network</p>
              </TooltipContent>
            </Tooltip>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4">
          <DropdownMenuLabel>
            <div className="flex items-center justify-center gap-x-2">
              <Jazzicon diameter={24} seed={jazznumber} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium text-popover-foreground">
                    {address?.slice(0, 5) + '...' + address?.slice(-4)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{address}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group">
            <button
              onClick={() => disconnect()}
              className="flex w-full items-center gap-x-2 text-sm text-popover-foreground"
            >
              <HiOutlineLogout className="text-xl" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Button
      onClick={() => open()}
      variant="outline"
      size="sm"
      className={cn('gap-x-2', buttonClassName)}
      icon={FaWallet}
      label="Connect Wallet"
    />
  );
};

export default ConnectButton;
