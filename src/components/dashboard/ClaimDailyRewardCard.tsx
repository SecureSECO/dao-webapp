/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Loading from '@/src/components/icons/Loading';
import { Card } from '@/src/components/ui/Card';
import {
  ConditionalButton,
  Warning,
} from '@/src/components/ui/ConditionalButton';
import { MainCard } from '@/src/components/ui/MainCard';
import TokenAmount from '@/src/components/ui/TokenAmount';
import {
  useTieredTimeClaimable,
  useTimeClaimable,
} from '@/src/hooks/useFacetFetch';
import { useTier } from '@/src/hooks/useTier';
import { toast } from '@/src/hooks/useToast';
import { TOKENS } from '@/src/lib/constants/tokens';
import { BigNumber } from 'ethers';
import { HiGift } from 'react-icons/hi2';

import { Progress } from '../ui/Progress';

export const ClaimDailyRewardCard = () => {
  const { data: timeClaimable, loading, error, refetch } = useTimeClaimable();

  const handleClaimReward = async () => {
    if (!timeClaimable) return;
    toast.contractTransaction(timeClaimable.claimReward, {
      error: 'Could not claim reward',
      success: 'Reward claimed!',
      onSuccess: () => refetch(),
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
              amount={timeClaimable?.amountClaimable}
              tokenDecimals={TOKENS.rep.decimals}
              symbol={TOKENS.rep.symbol}
              displayDecimals={0}
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
              timeClaimable !== null &&
              BigNumber.from(0).eq(timeClaimable.amountClaimable),
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
