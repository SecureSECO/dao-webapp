/**
 * A module that exports the `Address` component for displaying Ethereum addresses, optionally with a link to Etherscan/Polyscan and a copy-to-clipboard button.
 */
import { cva } from 'class-variance-authority';
import React from 'react';
import { HiClipboardCopy } from 'react-icons/hi';
import { useAccount } from 'wagmi';

export enum AddressLength {
  Small = 10,
  Medium = 20,
  Large = 40,
  Full = -1, // no trunction
}

type AddressProps = {
  address: string;
  maxLength: AddressLength;
  hasLink: boolean;
  showCopy: boolean;
  replaceYou?: boolean;
};

/**
 * Truncates the middle of a string with an ellipsis if it is longer than a specified maximum length. maximum length must be at least 4 or more
 * @param address - The string to truncate.
 * @param maxLength - The maximum length of the string. If the string is longer than this, it will be truncated in the middle with an ellipsis. A negative value means no truncation. Minimum value is 4.
 * @returns - The truncated string.
 * @example
 * const truncated = truncateMiddle("0x1234567890123456789012345678901234567890", 20);
 * console.log(truncated); // "0x1234567…234567890"
 */
const truncateMiddle = (address: string, maxLength: number) => {
  if (address.length <= maxLength || maxLength < 0) return address;
  const lengthToKeep = maxLength - 2;
  const start = address.slice(0, lengthToKeep / 2);
  const end = address.slice(-lengthToKeep / 2);
  return `${start}…${end}`;
};

/**
 * Copies a string to the clipboard.
 * @param address - The string to copy to the clipboard.
 * @returns
 * @example
 * copyToClipboard("0x1234567890123456789012345678901234567890");
 */
const copyToClipboard = (address: string) => {
  navigator.clipboard.writeText(address);
};

/**
 * A component for displaying Ethereum addresses, optionally with a link to Etherscan and a copy-to-clipboard button.
 * @param props - Props for the `Address` component.
 * @param props.address - The Ethereum address to display.
 * @param props.maxLength - The maximum length of the displayed address. If the address is longer than this, it will be truncated in the middle with an ellipsis. A negative value means no truncation.
 * @param props.hasLink - Whether the displayed address should be linked to its corresponding page on Etherscan.
 * @param props.showCopy - Whether to display a copy-to-clipboard button next to the address.
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
}) => {
  const truncated = truncateMiddle(
    '0x1234567890123456789012345678901234567890',
    20
  );
  console.log(truncated);

  const { address: currentUser } = useAccount();
  const etherscanURL = `https://etherscan.io/address/${address}`;
  // if the address is the current user's address, replace it with "you"
  const content =
    address.toLowerCase() === currentUser?.toLowerCase() && replaceYou
      ? 'you'
      : truncateMiddle(address, maxLength);

  const handleClick = () => {
    if (showCopy) {
      copyToClipboard(address);
    }
  };

  return (
    <div className="flex items-center">
      {hasLink ? (
        <a
          href={etherscanURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          {content}
        </a>
      ) : (
        <span>{content}</span>
      )}

      {showCopy && (
        <button
          onClick={handleClick}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <HiClipboardCopy size={18} />
        </button>
      )}
    </div>
  );
};
