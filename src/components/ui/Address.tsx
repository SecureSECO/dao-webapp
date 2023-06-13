/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * A module that exports the `Address` component for displaying Ethereum addresses, optionally with a link to Etherscan/Polyscan and a copy-to-clipboard button.
 */

import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { toast } from '@/src/hooks/useToast';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { cn, copyToClipboard, truncateMiddle } from '@/src/lib/utils';
import { HiCheck, HiDocumentDuplicate } from 'react-icons/hi2';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useAccount } from 'wagmi';

const addressLengthVariants = {
  sm: 10,
  md: 20,
  lg: 40,
  full: -1,
};

const jazziconVariants = {
  none: 0,
  sm: 16,
  md: 24,
  lg: 32,
};

type AddressProps = {
  address: string;
  length?: keyof typeof addressLengthVariants | number;
  hasLink?: boolean;
  showCopy?: boolean;
  replaceYou?: boolean;
  jazziconSize?: keyof typeof jazziconVariants | number;
  className?: string;
};

/**
 * A component for displaying Ethereum addresses, optionally with a link to Etherscan and a copy-to-clipboard button.
 * @param props - Props for the `Address` component.
 * @param props.address - The Ethereum address to display.
 * @param props.maxLength - The maximum length of the displayed address. If the address is longer than this, it will be truncated in the middle with an ellipsis. A negative value means no truncation.
 * @param props.hasLink - Whether the displayed address should be linked to its corresponding page on Etherscan.
 * @param props.showCopy - Whether to display a copy-to-clipboard button next to the address.
 * @param props.jazziconSize - The size of the Jazzicon to display next to the address (0 to show no Jazzicon)
 * @param [props.replaceYou=true] - Whether to replace the user's own Ethereum address with "you" in the displayed text.
 * @returns - A React element representing the `Address` component.
 * @remarks
 * This component uses the `useAccount` hook from the `wagmi` package to check the current user's Ethereum address.
 * If the `replaceYou` prop is set to `true`, and the displayed address matches the current user's address, it will be replaced with the string "you".
 */

export const Address: React.FC<AddressProps> = ({
  address,
  length = 'md',
  hasLink = false,
  showCopy = false,
  replaceYou = false,
  jazziconSize = 'none',
  className,
}) => {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');
  const { address: currentUser } = useAccount();
  const blockExplorer = `${PREFERRED_NETWORK_METADATA.explorer}address/${address}`;

  // if the address is the current user's address, replace it with "you"
  const linkContent =
    address.toLowerCase() === currentUser?.toLowerCase() && replaceYou
      ? 'you'
      : truncateMiddle(
          address,
          typeof length === 'number' ? length : addressLengthVariants[length]
        );

  const handleClick = () => {
    if (showCopy) {
      copyToClipboard(address);
      setStatus('copied');
      toast.success({
        title: 'Copied to clipboard!',
      });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className={cn('flex flex-row items-center gap-x-2', className)}>
      {jazziconSize !== 'none' && (
        <Jazzicon
          diameter={
            typeof jazziconSize === 'number'
              ? jazziconSize
              : jazziconVariants[jazziconSize]
          }
          seed={jsNumberForAddress(address!)}
        />
      )}
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild className="rounded-sm">
            {hasLink ? (
              <a
                href={blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-highlight underline transition-colors duration-200 hover:text-primary-highlight/80"
              >
                {linkContent}
              </a>
            ) : (
              <span>{linkContent}</span>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {hasLink ? <p>Open in block explorer</p> : <p>{address}</p>}
          </TooltipContent>
        </Tooltip>

        {showCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleClick}
                className="ml-2 rounded-sm transition-opacity duration-200 hover:opacity-80"
              >
                {status === 'copied' ? (
                  <HiCheck className="text-[1.15em]" />
                ) : (
                  <HiDocumentDuplicate className="text-[1.15em]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy address</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
