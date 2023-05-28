/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Button, ButtonProps } from '@/src/components/ui/Button';
import { useWeb3Modal } from '@web3modal/react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

export type ConditionalWarning = {
  when: boolean;
  content: JSX.Element;
};

export interface ConditionalButtonProps extends ButtonProps {
  conditions: ConditionalWarning[];
}

export const ConditionalButton = React.forwardRef<
  HTMLButtonElement,
  ConditionalButtonProps
>(({ conditions, disabled, ...props }, ref) => {
  const condition = conditions.find((x) => x.when);
  const someConditional = condition !== undefined;
  return (
    <div className="flex flex-row items-center gap-x-2">
      <Button ref={ref} disabled={disabled || someConditional} {...props} />
      {someConditional && condition.content}
    </div>
  );
});
ConditionalButton.displayName = 'ConditionalButton';

export interface WarningWithActionProps {
  action: string;
}

/**
 * Shows a warning with a warning icon and the provided warning text
 * @param props.children A ReactNode that represents the warning
 * @returns A div with a warning message
 */
export const Warning = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center gap-x-1 opacity-80">
      <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
      <p className="leading-4">{children}</p>
    </div>
  );
};

/**
 * Shows a warning that the user needs to connect their wallet to perform the action specified
 * @param props.action A string that represents the action the user is trying to perform (e.g. "to vote")
 * @returns A div with a warning message and a subtle button to connect the wallet
 */
export const ConnectWalletWarning = ({ action }: WarningWithActionProps) => {
  const { open } = useWeb3Modal();

  return (
    <Warning>
      <button
        type="button"
        className="rounded-sm ring-ring ring-offset-2 ring-offset-background hover:underline focus:outline-none focus:ring-1"
        onClick={() => open()}
      >
        Connect
      </button>{' '}
      your wallet {action}
    </Warning>
  );
};

/**
 * Shows a warning that the user does not own enough REP (voting power) to perform the action specified
 * @param props.action A string that represents the action the user is trying to perform (e.g. "to vote")
 * @returns A div with a warning message
 */
export const InsufficientRepWarning = ({ action }: WarningWithActionProps) => (
  <Warning> {`Insufficient voting power ${action}`} </Warning>
);
