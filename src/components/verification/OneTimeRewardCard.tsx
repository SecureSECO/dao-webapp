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
// import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';

/**
 * @returns A card that allows the users to claim their reward for verifying
 */
const OneTimeRewardCard = () => {
  // const fetchData = async () => {
  // }

  const claimReward = async () => {
    // if (typeof window.ethereum === 'undefined')
    //   throw new Error('No ethereum provider found');
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send('eth_requestAccounts', []);
    // const signer = provider.getSigner();
    // try {
    //   const client = new DiamondGovernanceClient(DGaddress, signer);
    //   const claimer = await client.pure.IERC20OneTimeVerificationRewardFacet();
    //   const transaction = await claimer.claimVerificationRewardAll();
    //   await transaction.wait();
    //   fetchData();
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  return (
    <Card variant="light" className="flex flex-col gap-y-2 font-normal">
      <Header level={3}>Verification Reward</Header>
      <p>
        Because you have successfully verified your address using one or more
        providers, you are eligible to claim a reward.
      </p>
      <p>
        Claimable tokens: <strong>100</strong>
      </p>
      <Button onClick={claimReward}>Claim reward</Button>
    </Card>
  );
};

export default OneTimeRewardCard;
