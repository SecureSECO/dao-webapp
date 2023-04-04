import { Button } from '@/src/components/ui/Button';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount, useContractRead, useSignMessage } from 'wagmi';
import { verificationAbi } from '../assets/verificationAbi';
import StampCard from '../components/ui/StampCard';
import { MainCard } from '../components/ui/MainCard';
import { HiCheckBadge, HiClock, HiUserCircle } from 'react-icons/hi2';
import { AiFillGithub, AiFillTwitterCircle } from 'react-icons/ai';
import { BigNumber } from 'ethers';
import RecentVerificationCard from '../components/ui/RecentVerificationCard';

export type Stamp = [id: string, _hash: string, verifiedAt: BigNumber[]];
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

export type VerificationThreshold = [
  timestamp: BigNumber,
  threshold: BigNumber
];

export const availableStamps: StampInfo[] = [
  {
    id: 'proofofhumanity',
    displayName: 'Proof of Humanity',
    url: 'https://www.proofofhumanity.id/',
    icon: <HiUserCircle size={20} />,
  },
  {
    id: 'github',
    displayName: 'GitHub',
    url: 'https://github.com/',
    icon: <AiFillGithub size={20} />,
  },
  {
    id: 'twitter',
    displayName: 'Twitter',
    url: 'https://twitter.com/',
    icon: <AiFillTwitterCircle size={20} />,
  },
];

/**
 * Check if a given stamp is currently verified
 * @param thresholdHistory The threshold history
 * @param stamp The stamp
 * @returns An object containing information about the verification status
 */
export const isVerified = (
  thresholdHistory: VerificationThreshold[],
  stamp: Stamp | null
) => {
  const threshold = getThresholdForTimestamp(
    Date.now() / 1000,
    thresholdHistory
  );
  const lastVerifiedAt = stamp
    ? stamp[2][stamp[2].length - 1]
    : BigNumber.from(0);

  const preCondition: boolean =
    stamp != null &&
    stamp[2] != null &&
    stamp[2].length > 0 &&
    thresholdHistory != null &&
    thresholdHistory.length > 0 &&
    Date.now() / 1000 > lastVerifiedAt.toNumber();

  const verified =
    preCondition &&
    stamp != null &&
    Date.now() / 1000 <
      lastVerifiedAt.add(threshold.mul(24 * 60 * 60)).toNumber();

  const expired =
    preCondition &&
    stamp != null &&
    Date.now() / 1000 >
      lastVerifiedAt.add(threshold.mul(24 * 60 * 60)).toNumber();

  let timeLeftUntilExpiration = null;
  if (verified) {
    timeLeftUntilExpiration =
      lastVerifiedAt.add(threshold.mul(24 * 60 * 60)).toNumber() -
      Date.now() / 1000;
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
const getThresholdForTimestamp = (
  timestamp: number,
  thresholdHistory: VerificationThreshold[]
) => {
  let threshold = thresholdHistory.reverse().find((threshold) => {
    return timestamp >= threshold[0].toNumber();
  });

  return threshold ? threshold[1] : BigNumber.from(0);
};

const Verification = () => {
  const { address } = useAccount();

  const { data, isError, error, isLoading } = useContractRead({
    address: import.meta.env.VITE_VERIFY_CONTRACT,
    abi: verificationAbi,
    functionName: 'getStamps',
    args: [address],
  });

  const { data: rData } = useContractRead({
    address: import.meta.env.VITE_VERIFY_CONTRACT,
    abi: verificationAbi,
    functionName: 'reverifyThreshold',
    args: [],
  });

  const {
    data: vData,
    isError: vIsError,
    error: vError,
    isLoading: vIsLoading,
  } = useContractRead({
    address: import.meta.env.VITE_VERIFY_CONTRACT,
    abi: verificationAbi,
    functionName: 'getThresholdHistory',
    args: [],
  });

  const { signMessage } = useSignMessage({
    onError(error) {
      toast.error(error.message.substr(0, 100));
    },
    async onSuccess(data) {
      try {
        // Send the signature to the API
        const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            signature: data,
            nonce: nonce.toString(),
            providerId,
          }),
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        const { ok, message, url } = await response.json();

        if (ok) {
          window.location.href = url;
        } else {
          throw new Error('Verification failed: ' + message);
        }
      } catch (error: any) {
        toast.error(error.message.substr(0, 100));
      }
    },
  });

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<
    VerificationHistory[]
  >([]);
  const [thresholdHistory, setThresholdHistory] = useState<
    VerificationThreshold[]
  >([]);
  const [reverifyThreshold, setReverifyThreshold] = useState<number>(30);
  const [nonce, setNonce] = useState<number>(0);
  const [providerId, setProviderId] = useState<string>('');

  const amountOfVerifiedStamps = stamps.filter(
    (stamp) => isVerified(thresholdHistory, stamp).verified
  ).length;

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const stamps: Stamp[] = data.map((stamp: any) => [
        stamp.id,
        stamp._hash,
        stamp.verifiedAt,
      ]);

      setStamps(stamps);

      let verificationHistory: VerificationHistory[] = [];
      for (let i = 0; i < stamps.length; i++) {
        const stamp = stamps[i];
        for (let j = 0; j < stamp[2].length; j++) {
          verificationHistory.push({
            id: stamp[0],
            timestamp: stamp[2][j].toNumber(),
            isExpired: isVerified(thresholdHistory, stamp).expired,
            stamp: stamp,
          });
        }
      }

      verificationHistory.sort((a, b) => b.timestamp - a.timestamp);

      setVerificationHistory(verificationHistory);

      console.log(verificationHistory);
    }

    if (vData && Array.isArray(vData)) {
      setThresholdHistory(vData);
    }

    if (rData != null) {
      setReverifyThreshold((rData as BigNumber).toNumber());
    }
  }, [data, vData, rData]);

  const verify = async (providerId: string) => {
    try {
      // Check if the account has already verified
      const stamp = stamps.find(([id]) => id === providerId);
      if (stamp) {
        const [, , verifiedAt] = stamp;
        const lastVerifiedAt = verifiedAt[verifiedAt.length - 1];

        // Check if it has been more than the reverifyThreshold
        if (
          lastVerifiedAt.toNumber() * 1000 +
            reverifyThreshold * 24 * 60 * 60 * 1000 >
          Date.now()
        ) {
          throw new Error(
            `You have already verified with this provider, please wait at least ${Math.round(
              reverifyThreshold
            )} days after the initial verification to verify again.`
          );
        }
      }

      const nonce = Math.floor(Math.random() * 1000000);
      setNonce(nonce);
      setProviderId(providerId);

      // Sign a message with the account
      signMessage({
        message: `SecureSECO DAO Verification \nN:${nonce}`,
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message.substr(0, 100));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard title="Verification" aside={<></>}>
        <p className="text-base font-normal text-slate-500 dark:text-slate-400">
          You can verify your identity on a variety platforms to prove that you
          are a real person.
        </p>
      </HeaderCard>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <MainCard
          className="basis-3/5"
          loading={false}
          icon={HiCheckBadge}
          header={
            <div className="flex flex-row items-end gap-x-2">
              <span className="text-3xl">{amountOfVerifiedStamps}</span>
              <p className="mb-1 leading-4">verified accounts</p>
            </div>
          }
          aside={
            // <Button
            //   label="New proposal"
            //   onClick={() => console.log('New proposal click!')}
            // />
            <></>
          }
        >
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
            </div>
          ) : isError ? (
            <div>
              <p>
                There was an error fetching your stamps. Please try again later.
              </p>
              <p className="mt-4">
                Information: <code>{error?.message}</code>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-y-8">
              <div className="flex flex-wrap gap-6">
                {availableStamps.map((stampInfo) => (
                  <StampCard
                    key={stampInfo.id}
                    stampInfo={stampInfo}
                    stamp={stamps.find(([id]) => id === stampInfo.id) || null}
                    thresholdHistory={thresholdHistory ?? []}
                    verify={verify}
                  />
                ))}
              </div>
            </div>
          )}
        </MainCard>
        <MainCard
          className="basis-2/5"
          loading={false}
          icon={HiClock}
          header={
            <div className="flex flex-row items-end gap-x-2">
              <span className="text-3xl">{verificationHistory.length}</span>
              <p className="mb-1 leading-4">total verifications</p>
            </div>
          }
          aside={<></>}
        >
          {verificationHistory?.map((history, index) => (
            <RecentVerificationCard key={index} history={history} />
          ))}
        </MainCard>
      </div>
    </div>
  );
};

export default Verification;
