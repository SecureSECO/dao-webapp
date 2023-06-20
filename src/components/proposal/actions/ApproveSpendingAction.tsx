/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
import { Address } from '@/src/components/ui/Address';
import { Card } from '@/src/components/ui/Card';
import { ACTIONS } from '@/src/lib/constants/actions';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { TokenInfo, getTokenInfo } from '@/src/lib/utils/token';
import { Action } from '@plopmenz/diamond-governance-sdk';
import { AccordionItemProps } from '@radix-ui/react-accordion';
import { BigNumber, constants } from 'ethers';
import { useProvider } from 'wagmi';

import Loading from '../../icons/Loading';
import TokenAmount from '../../ui/TokenAmount';
import ActionWrapper from './ActionWrapper';

export interface ProposalApproveSpendingAction extends Action {
  params: {
    spender: string;
    amount: BigNumber;
    _contractAddress: string;
  };
}
interface DiamondCutActionProps extends AccordionItemProps {
  action: ProposalApproveSpendingAction;
}

export const ApproveSpendingAction = ({
  action,
  ...props
}: DiamondCutActionProps) => {
  const { loading, tokenInfo } = useTokenInfo(action.params._contractAddress);

  const isUnlimited = action.params.amount.eq(constants.MaxUint256);
  const showTokenAmount = !loading && tokenInfo !== null;

  return (
    <ActionWrapper
      icon={ACTIONS.approve_spending.icon}
      title="Approve ERC20 spending"
      description={`
Approve a spender to spend an amount of ${
        tokenInfo === null ? 'ERC20 token' : tokenInfo.name
      }.
      `}
      {...props}
    >
      <div className="space-y-2 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">
              Spender Address
            </p>
            <Address className="font-medium" address={action.params.spender} />
          </Card>
          <Card variant="outline" size="sm">
            <p className="text-xs text-popover-foreground/80">
              Approved Amount
            </p>
            {loading && <Loading className="w-5 h-5" />}
            {!loading && tokenInfo === null && action.params.amount.toString()}
            {showTokenAmount && isUnlimited && `unlimited ${tokenInfo.symbol}`}
            {showTokenAmount && !isUnlimited && (
              <TokenAmount
                amount={action.params.amount}
                tokenDecimals={tokenInfo?.decimals}
                symbol={tokenInfo?.symbol}
              />
            )}
          </Card>
        </div>
      </div>
    </ActionWrapper>
  );
};

const useTokenInfo = (contractAddress: string) => {
  const provider = useProvider();

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTokenInfo = async () => {
    setLoading(true);
    try {
      const info = await getTokenInfo(
        contractAddress,
        provider,
        PREFERRED_NETWORK_METADATA.nativeCurrency
      );
      setTokenInfo(info);
    } catch {
      setTokenInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenInfo();
  }, [contractAddress]);

  return { tokenInfo, loading };
};
