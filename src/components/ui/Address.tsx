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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/Tooltip';
import { toast } from '@/src/hooks/useToast';
import { copyToClipboard, truncateMiddle } from '@/src/lib/utils';
import React, { useState } from 'react';
import { HiCheck, HiDocumentDuplicate } from 'react-icons/hi2';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useAccount } from 'wagmi';

export enum AddressLength {
  Small = 10,
  Medium = 20,
  Large = 40,
  Full = -1, // no trunction
}

const jazziconVariants = {
  none: 0,
  sm: 16,
  md: 24,
  lg: 32,
};

type AddressProps = {
  address: string;
  maxLength: AddressLength;
  hasLink: boolean;
  showCopy: boolean;
  replaceYou?: boolean;
  jazziconSize?: 'sm' | 'md' | 'lg' | 'none';
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
  maxLength,
  hasLink,
  showCopy,
  replaceYou = true,
  jazziconSize = 'none',
}) => {
  const [status, setStatus] = useState<'idle' | 'copied'>('idle');
  const { address: currentUser } = useAccount();
  const etherscanURL = `https://etherscan.io/address/${address}`;

  // if the address is the current user's address, replace it with "you"
  const linkContent =
    address.toLowerCase() === currentUser?.toLowerCase() && replaceYou
      ? 'you'
      : truncateMiddle(address, maxLength);

  const handleClick = () => {
    if (showCopy) {
      copyToClipboard(address);
      setStatus('copied');
      toast({
        title: 'Copied to clipboard!',
        variant: 'success',
      });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="flex flex-row items-center gap-x-2">
      {jazziconSize !== 'none' && (
        <Jazzicon
          diameter={jazziconVariants[jazziconSize]}
          seed={jsNumberForAddress(address!)}
        />
      )}
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="rounded-sm">
              {hasLink ? (
                <a
                  href={etherscanURL}
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
              <p>Open in block explorer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showCopy && (
          <TooltipProvider>
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
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
