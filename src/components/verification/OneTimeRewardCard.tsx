/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Label } from '@/src/components/ui/Label';
import { MainCard } from '@/src/components/ui/MainCard';
import TokenAmount from '@/src/components/ui/TokenAmount';
import { toast } from '@/src/hooks/useToast';
import { TOKENS } from '@/src/lib/constants/tokens';
import { BigNumber, ContractTransaction } from 'ethers';
import { HiGift } from 'react-icons/hi2';

/**
 * @returns A card that allows the users to claim their reward for verifying
 */
const OneTimeRewardCard = ({
  reward,
  claimReward,
  refetch,
}: {
  reward: [BigNumber, BigNumber];
  claimReward: () => Promise<ContractTransaction>;
  refetch: () => void;
}) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimReward = async () => {
    if (isClaiming) return;

    setIsClaiming(true);
    toast.contractTransaction(claimReward, {
      success: 'Successfully claimed reward!',
      error: 'Could not claim reward',
      onFinish() {
        setIsClaiming(false);
        refetch();
      },
    });
  };

  return (
    <MainCard
      className="flex flex-col gap-y-2"
      icon={HiGift}
      header="Verification reward"
    >
      <p>
        You are eligible to claim a onetime verification reward for verifying
        your wallet with one or more providers.
      </p>
      <Label>Claimable amount</Label>
      <div className="flex items-center gap-2">
        <Card variant="outline" className="flex flex-row items-center gap-x-2">
          <TokenAmount
            amount={reward[0]}
            tokenDecimals={TOKENS.rep.decimals}
            symbol={TOKENS.rep.symbol}
            displayDecimals={0}
          />
        </Card>
        <Card variant="outline" className="flex flex-row items-center gap-x-2">
          <TokenAmount
            amount={reward[1]}
            tokenDecimals={TOKENS.secoin.decimals}
            symbol={TOKENS.secoin.symbol}
            displayDecimals={0}
          />
        </Card>
      </div>
      <Button
        label="Claim reward"
        onClick={handleClaimReward}
        disabled={isClaiming}
      />
    </MainCard>
  );
};

export default OneTimeRewardCard;
