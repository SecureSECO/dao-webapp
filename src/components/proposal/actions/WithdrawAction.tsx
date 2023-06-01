/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import ActionWrapper from '@/src/components/proposal/actions/ActionWrapper';
import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { CONFIG } from '@/src/lib/constants/config';
import {
  TokenInfo,
  getTokenInfo,
  toAbbreviatedTokenAmount,
} from '@/src/lib/utils/token';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { BigNumber } from 'ethers';
import { HiArrowRight, HiBanknotes } from 'react-icons/hi2';
import { useProvider } from 'wagmi';

/**
 * Interface for a withdraw assets action.
 * The exact parameters depend on the type of token that is being withdrawn.
 * See file /src/lib/constants/actions.tsx for the different types of tokens and their parameters.
 */
export interface ProposalWithdrawAction extends Action {
  params: {
    _from?: string;
    _to: string;
    _value?: BigNumber; // In case of NATIVE token
    _amount?: BigNumber;
    _contractAddress?: string;
    _tokenId?: BigNumber; // In case of ERC721 or ERC1155
  };
}

interface WithdrawActionProps extends AccordionItemProps {
  action: ProposalWithdrawAction;
}

/**
 * Shows the details of a withdraw assets action
 * @param props.action Action of type ProposalWithdrawAction to be shown
 * @returns Details of a withdraw assets action wrapped in a GeneralAction component
 */
const WithdrawAction = ({ action, ...props }: WithdrawActionProps) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

  const provider = useProvider({
    chainId: CONFIG.PREFERRED_NETWORK_ID,
  });

  // If _value is present in params, the token being withdrawn is the native token
  const isNative = !!action.params._value;

  useEffect(() => {
    async function fetchTokenInfo() {
      const fetchedTokenInfo = await getTokenInfo(
        action.params._contractAddress,
        provider,
        PREFERRED_NETWORK_METADATA.nativeCurrency,
        action.params._tokenId ? 'erc721' : 'erc20'
      );
      setTokenInfo(fetchedTokenInfo);
    }

    if (provider && !isNative) {
      fetchTokenInfo();
    }
  }, [action]);

  return (
    <ActionWrapper
      icon={HiBanknotes}
      title="Withdraw assets"
      description="Withdraw assets from the DAO treasury"
      {...props}
    >
      <div className="space-y-2">
        <Card
          variant="outline"
          size="sm"
          className="flex flex-row items-center justify-between"
        >
          <p className="text-xl font-medium leading-9">
            {isNative
              ? PREFERRED_NETWORK_METADATA.nativeCurrency.name
              : tokenInfo?.name ?? 'Unknown token'}
          </p>
          <p className="text-base text-popover-foreground/80">
            {isNative || tokenInfo?.decimals !== undefined
              ? toAbbreviatedTokenAmount({
                  value: isNative
                    ? action.params._value
                    : action.params._amount ?? BigNumber.from(1),
                  tokenDecimals:
                    tokenInfo?.decimals ??
                    PREFERRED_NETWORK_METADATA.nativeCurrency.decimals,
                  displayDecimals: action.params._tokenId ? 0 : 2, // Round to integer for ERC721/ERC1155
                })
              : '?'}{' '}
            {isNative
              ? PREFERRED_NETWORK_METADATA.nativeCurrency.symbol
              : tokenInfo?.symbol}
          </p>
        </Card>
        <div className="flex flex-row items-center justify-between gap-x-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">From</p>
            <p className="font-medium">DAO Treasury</p>
          </Card>
          <HiArrowRight className="h-4 w-4 shrink-0 text-popover-foreground/80" />
          <Card variant="outline" size="sm" className="font-medium">
            <p className="text-xs font-normal text-popover-foreground/80">To</p>
            <Address address={action.params._to} replaceYou />
          </Card>
        </div>
      </div>
    </ActionWrapper>
  );
};

export default WithdrawAction;
