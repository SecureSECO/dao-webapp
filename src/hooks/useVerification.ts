/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react';
import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { Stamp, VerificationThreshold } from '@plopmenz/diamond-governance-sdk';
import { useAccount } from 'wagmi';
import { BigNumber, ethers } from 'ethers';

/**
 * This type contains info about a certain verification method (GitHub, Twitter, etc.), that is not stored on-chain.
 */
export type StampInfo = {
  id: string;
  displayName: string;
  url: string;
  icon: JSX.Element;
};

export type VerificationHistory = {
  id: string;
  timestamp: number;
  isExpired: boolean;
  stamp: Stamp;
};

export type VerificationStatus = {
  verified: boolean;
  expired: boolean;
  preCondition: boolean;
  timeLeftUntilExpiration: number | null;
};

export type PendingVerification = {
  addressToVerify: string;
  hash: string;
  timestamp: string;
  providerId: string;
  sig: string;
};

export const useVerification = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stamps, setStamps] = useState<Stamp[] | null>(null);
  const [thresholdHistory, setThresholdHistory] = useState<
    VerificationThreshold[]
  >([]);
  const [reverifyThreshold, setReverifyThreshold] = useState<number>(30);
  const [verificationHistory, setVerificationHistory] = useState<
    VerificationHistory[]
  >([]);
  const [reward, setReward] = useState<BigNumber | null>(null);

  const { client } = useDiamondSDKContext();
  const { address } = useAccount();

  /**
   * Verifies the user
   * @param addressToVerify The address to verify
   * @param userHash Hash data of some unique user data
   * @param timestamp Timestamp of the verification
   * @param providerId The id of the provider to verify with
   * @param proofSignature The proof that was provided by the server
   */
  const verify = async (
    addressToVerify: string,
    userHash: string,
    timestamp: number,
    providerId: string,
    proofSignature: string
  ) => {
    if (!client) throw new Error('No client found');

    try {
      return await client.verification.Verify(
        addressToVerify,
        userHash,
        timestamp,
        providerId,
        proofSignature
      );
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      throw e;
    }
  };

  /**
   * Unverifies the user
   * @param providerId The id of the provider to unverify with
   */
  const unverify = async (providerId: string) => {
    if (!client) throw new Error('No client found');
    return await client.verification.Unverify(providerId);
  };

  /**
   * Check if a given stamp is currently verified
   * @param thresholdHistory The threshold history
   * @param stamp The stamp
   * @returns An object containing information about the verification status
   */
  const isVerified = (stamp: Stamp | null): VerificationStatus => {
    const threshold = getThresholdForTimestamp(Date.now() / 1000);
    const lastVerifiedAt =
      stamp && stamp[2].length > 0
        ? stamp[2][stamp[2].length - 1]
        : BigNumber.from(0);

    const preCondition: boolean =
      stamp != null &&
      stamp[2] != null &&
      stamp[2].length > 0 &&
      thresholdHistory != null &&
      thresholdHistory.length > 0 &&
      Date.now() / 1000 > lastVerifiedAt.toNumber();

    const lastEligibleDate = lastVerifiedAt.add(threshold.mul(24 * 60 * 60));

    const verified =
      preCondition &&
      stamp != null &&
      Date.now() / 1000 < lastEligibleDate.toNumber();

    const expired =
      preCondition &&
      stamp != null &&
      Date.now() / 1000 > lastEligibleDate.toNumber();

    // Time left until expiration in seconds
    let timeLeftUntilExpiration = null;
    if (verified) {
      timeLeftUntilExpiration = lastEligibleDate.toNumber() - Date.now() / 1000;
    }

    return {
      verified,
      expired,
      preCondition,
      timeLeftUntilExpiration,
    };
  };

  /**
   * Gets the threshold for a given timestamp
   * @param timestamp The timestamp in seconds
   * @param thresholdHistory The threshold history
   * @returns The threshold at the given timestamp
   */
  const getThresholdForTimestamp = (timestamp: number) => {
    let threshold = thresholdHistory.reverse().find((threshold) => {
      return timestamp >= threshold[0].toNumber();
    });

    return threshold ? threshold[1] : BigNumber.from(0);
  };

  /**
   * Claims all the pending rewards for verifying
   */
  const claimReward = async () => {
    if (!client) throw new Error('No client found');
    const oneTimeVerificationRewardFacet =
      await client.pure.IERC20OneTimeVerificationRewardFacet();
    return await oneTimeVerificationRewardFacet.claimVerificationRewardAll();
  };

  /**
   * Fetches the stamps for the current user
   */
  const fetchStamps = async () => {
    if (!client || !address) return;

    try {
      const _stamps = await client.verification.GetStamps(address);
      setStamps(_stamps);
      // Convert stamps to verification history
      let verificationHistory: VerificationHistory[] = [];
      for (let i = 0; i < _stamps.length; i++) {
        const stamp = _stamps[i];
        for (let j = 0; j < stamp[2].length; j++) {
          verificationHistory.push({
            id: stamp[0],
            timestamp: stamp[2][j].toNumber(),
            isExpired: isVerified(stamp).expired,
            stamp: stamp,
          });
        }
      }

      // Sort verification history by timestamp, newest first
      verificationHistory.sort((a, b) => b.timestamp - a.timestamp);

      setVerificationHistory(verificationHistory);

      setLoading(false);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  /**
   * Fetches the threshold history, which indicates how long
   */
  const fetchThresholdHistory = async () => {
    if (!client) return;

    try {
      const _thresholdHistory = await client.verification.GetThresholdHistory();
      setThresholdHistory(_thresholdHistory);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  /**
   * Fetches reverification threshold
   */
  const fetchReverificationThreshold = async () => {
    if (!client) return;

    try {
      const verificationContract =
        await client.verification.GetVerificationContract();
      const _reverifyThreshold = await verificationContract.reverifyThreshold();

      setReverifyThreshold(_reverifyThreshold.toNumber());
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  /**
   * Fetches the total verification reward for the current user
   */
  const fetchReward = async () => {
    if (!client) return;

    try {
      const facet = await client.pure.IERC20OneTimeVerificationRewardFacet();
      const _reward = await facet.tokensClaimableVerificationRewardAll();
      setReward(_reward);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoading(false);
    }
  };

  /**
   * Fetches all verification data from the blockchain
   */
  const refetch = async () => {
    if (!client) return;

    setLoading(true);

    const promises = [fetchThresholdHistory(), fetchReverificationThreshold()];

    // Prevent data being loaded from zero address
    if (
      (await client.pure.signer.getAddress()) !== ethers.constants.AddressZero
    ) {
      promises.push(fetchStamps());
      promises.push(fetchReward());
    }

    Promise.allSettled(promises).then(() => {
      setLoading(false);
    });
  };

  /**
   * Refetches data upon a change in the client
   */
  useEffect(() => {
    refetch();
  }, [client]);

  return {
    loading,
    error,
    verify,
    unverify,
    refetch,
    getThresholdForTimestamp,
    isVerified,
    claimReward,
    thresholdHistory,
    reverifyThreshold,
    verificationHistory,
    stamps,
    reward,
  };
};
