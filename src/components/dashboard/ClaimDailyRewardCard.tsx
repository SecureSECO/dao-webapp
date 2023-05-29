/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useTimeClaimable } from '@/src/hooks/useTimeClaimable';
import { toast } from '@/src/hooks/useToast';
import { TOKENS } from '@/src/lib/constants/tokens';
import { BigNumber } from 'ethers';
import { HiGift } from 'react-icons/hi2';

import Loading from '../icons/Loading';
import { Card } from '../ui/Card';
import { ConditionalButton, Warning } from '../ui/ConditionalButton';
import { MainCard } from '../ui/MainCard';
import TokenAmount from '../ui/TokenAmount';

export const ClaimDailyRewardCard = () => {
  const { claimReward, amountClaimable, loading, error } = useTimeClaimable({});

  const handleClaimReward = async () => {
    toast.contractTransaction(claimReward, {
      error: 'Could not claim reward',
      success: 'Reward claimed!',
    });
  };

  return (
    <MainCard
      className="flex flex-col gap-y-2"
      icon={HiGift}
      header="Daily reward"
    >
      <p>You can claim free {TOKENS.rep.name} everyday.</p>
      <Card variant="outline" className="flex flex-row items-center gap-x-2">
        Claimable amount:
        <strong>
          {loading ? (
            <Loading className="h-5 w-5" />
          ) : (
            <TokenAmount
              amount={amountClaimable}
              tokenDecimals={TOKENS.rep.decimals}
              symbol={TOKENS.rep.symbol}
            />
          )}
        </strong>
      </Card>
      <ConditionalButton
        label="Claim"
        onClick={handleClaimReward}
        disabled={loading || error !== null}
        conditions={[
          {
            when:
              amountClaimable !== null && BigNumber.from(0).eq(amountClaimable),
            content: <Warning>No claimable rewards</Warning>,
          },
          {
            when: Boolean(error),
            content: <Warning>An error occured</Warning>,
          },
        ]}
      />
    </MainCard>
  );
};
