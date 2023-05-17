/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Card } from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { useState } from 'react';
import { useToast } from '@/src/hooks/useToast';
// import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';

/**
 * @returns A card that allows the users to claim their reward for verifying
 */
const OneTimeRewardCard = ({
  reward,
  claimReward,
  refetch,
}: {
  reward: number;
  claimReward: () => Promise<void>;
  refetch: () => void;
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const { promise: promiseToast } = useToast();

  return (
    <Card variant="light" className="flex flex-col gap-y-2 font-normal">
      <Header level={3}>Verification Reward</Header>
      <p>
        Because you have successfully verified your address using one or more
        providers, you are eligible to claim a reward.
      </p>
      <p>
        Claimable tokens: <strong>{reward}</strong>
      </p>
      <Button
        onClick={() => {
          if (isClaiming) return;

          setIsClaiming(true);
          const promise = claimReward();

          promiseToast(promise, {
            loading: 'Claiming reward...',
            success: 'Successfully claimed reward!',
            error: (err) => ({
              title: 'Failed to claim reward',
              description: err.message,
            }),
          });

          promise.finally(() => {
            setIsClaiming(false);
            refetch();
          });
        }}
      >
        Claim reward
      </Button>
    </Card>
  );
};

export default OneTimeRewardCard;
