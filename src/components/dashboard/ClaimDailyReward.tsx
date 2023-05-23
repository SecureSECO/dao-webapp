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

export const ClaimDailyReward = () => {
  const { claimReward, amountClaimable, loading, error } = useTimeClaimable({});

  const handleClaimReward = async () => {
    toast.contractTransaction(() => claimReward(), {
      error: 'Error: could not claim reward',
      success: 'Reward claimed!',
    });
  };

  return (
    <MainCard
      className="flex flex-col gap-y-2"
      icon={HiGift}
      header={<p className="mb-1 text-base leading-4">Daily reward</p>}
    >
      <p>Everyday you are eligible to claim a reward.</p>
      <Card variant="outline" className="flex flex-row items-center gap-x-2">
        Claimable {TOKENS.rep.name}:
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
        label="Claim reward"
        onClick={handleClaimReward}
        conditions={[
          {
            when: loading,
            content: <Loading className="h-5 w-5" />,
          },
          {
            when:
              amountClaimable !== null && BigNumber.from(0).eq(amountClaimable),
            content: <Warning>There is no reward to claim</Warning>,
          },
          {
            when: Boolean(error),
            content: (
              <Warning>
                Due to an error, daily rewards can not be claimed right now
              </Warning>
            ),
          },
        ]}
      />
    </MainCard>
  );
};
