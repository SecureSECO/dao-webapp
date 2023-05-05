/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useSignMessage } from 'wagmi';
import { verificationAbi } from '@/src/assets/verificationAbi';
import StampCard from '@/src/components/verification/StampCard';
import { DefaultMainCardHeader, MainCard } from '@/src/components/ui/MainCard';
import {
  HiArrowSmallRight,
  HiCheckBadge,
  HiOutlineClock,
  HiUserCircle,
} from 'react-icons/hi2';
import { BigNumber } from 'ethers';
import { FaGithub } from 'react-icons/fa';
import { useToast } from '@/src/hooks/useToast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import { Button } from '@/src/components/ui/Button';
import RecentVerificationCard from '@/src/components/verification/RecentVerificationCard';
import History from '@/src/components/icons/History';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PendingVerificationCard from '../components/verification/PendingVerificationCard';

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

export type PendingVerification = {
  addressToVerify: string;
  hash: string;
  timestamp: string;
  providerId: string;
  sig: string;
};

export const availableStamps: StampInfo[] = [
  {
    id: 'proofofhumanity',
    displayName: 'Proof of Humanity',
    url: 'https://www.proofofhumanity.id/',
    icon: <HiUserCircle className="h-7 w-7 shrink-0" />,
  },
  {
    id: 'github',
    displayName: 'GitHub',
    url: 'https://github.com/',
    icon: <FaGithub className="h-6 w-6 shrink-0" />,
  },
  // New methods of verification can be added here, for example:
  // {
  //   id: 'discord',
  //   displayName: 'Discord',
  //   url: 'https://discord.com/',
  //   icon: <FaDiscord size={20} />,
  // },
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

export const verificationAddress = import.meta.env.VITE_VERIFY_CONTRACT;

const Verification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingVerifications, setPendingVerifications] = useLocalStorage<
    PendingVerification[]
  >('pendingVerifications', []);

  const { address } = useAccount();
  const { toast } = useToast();

  // Gets all the stamps for the current address
  const {
    data,
    isError,
    isLoading: stampsLoading,
    refetch,
  } = useContractRead({
    address: verificationAddress,
    abi: verificationAbi,
    functionName: 'getStamps',
    args: [address],
  });

  // Gets the reverification threshold
  const { data: reverifyData, isLoading: reverifyLoading } = useContractRead({
    address: verificationAddress,
    abi: verificationAbi,
    functionName: 'reverifyThreshold',
    args: [],
  });

  // Gets the verification threshold history
  const { data: historyData, isLoading: historyLoading } = useContractRead({
    address: verificationAddress,
    abi: verificationAbi,
    functionName: 'getThresholdHistory',
    args: [],
  });

  // Sign our message to verify our address
  const { signMessage } = useSignMessage({
    onError() {
      toast({
        title: `Wait at least ${Math.round(
          reverifyThreshold
        )} days after previous verification to verify again`,
        variant: 'error',
      });
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

        // url is the callback url where we finish the verification
        const { ok, message, url } = await response.json();

        if (ok) {
          window.location.href = url;
        } else {
          throw new Error('Verification failed: ' + message);
        }
      } catch (error: any) {
        toast({
          title: error.message.substring(0, 100),
          variant: 'error',
        });
      }
    },
  });

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<
    VerificationHistory[]
  >([]);
  const [historyLimit, setHistoryLimit] = useState<number>(5);
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
      // Convert data to stamps
      const stamps: Stamp[] = data.map((stamp: any) => [
        stamp.providerId,
        stamp.userHash,
        stamp.verifiedAt,
      ]);

      setStamps(stamps);

      // Convert stamps to verification history
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

      // Sort verification history by timestamp, newest first
      verificationHistory.sort((a, b) => b.timestamp - a.timestamp);

      setVerificationHistory(verificationHistory);
    }

    if (historyData && Array.isArray(historyData)) {
      setThresholdHistory(historyData);
    }

    if (reverifyData != null) {
      setReverifyThreshold((reverifyData as BigNumber).toNumber());
    }
  }, [data, historyData, reverifyData]);

  useEffect(() => {
    // Check if there are any pending verifications in url params
    const searchParamSize = [...new Set(searchParams.keys())].length;
    if (searchParamSize === 0) {
      return;
    }

    const paramsObj: PendingVerification = {
      addressToVerify: searchParams.get('address') ?? '',
      hash: searchParams.get('hash') ?? '',
      timestamp: searchParams.get('timestamp') ?? '',
      providerId: searchParams.get('providerId') ?? '',
      sig: searchParams.get('sig') ?? '',
    };

    setSearchParams();

    // Check if paramsObj already exists in pendingVerificationsObj
    const alreadyExists = pendingVerifications.some(
      (obj: PendingVerification) => {
        return JSON.stringify(obj) === JSON.stringify(paramsObj);
      }
    );

    // If it doesn't exist, add it to the array
    if (!alreadyExists) {
      const obj = [...pendingVerifications, paramsObj];
      setPendingVerifications(obj);
    }
  }, [searchParams]);

  useEffect(() => {
    const lengthBefore = pendingVerifications.length;

    // Remove expired pending verifications
    const filteredPendingVerifications = pendingVerifications.filter(
      (obj: PendingVerification) => {
        const { timestamp } = obj;
        // Should verify within 1 hour of timestamp
        const expirationTime = parseInt(timestamp) + 60 * 60;
        return Date.now() / 1000 < expirationTime;
      }
    );

    if (lengthBefore !== filteredPendingVerifications.length) {
      setPendingVerifications(filteredPendingVerifications);
      console.log('filtered');
    }
  }, [pendingVerifications]);

  const verify = async (providerId: string) => {
    try {
      // Check if the account has already been verified
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
            `Wait at least ${Math.round(
              reverifyThreshold
            )} days after previous verification to verify again`
          );
        }
      }

      // Check if there is no pending verification for this provider which is still valid (1 hour)
      const pendingVerification = pendingVerifications.find(
        (obj: PendingVerification) =>
          obj.providerId === providerId &&
          Date.now() / 1000 < parseInt(obj.timestamp) + 60 * 60
      );

      if (pendingVerification) {
        throw new Error(
          'There is already a pending verification for this provider'
        );
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
      toast({
        title: error.message.substring(0, 100),
        variant: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard title="Verification" />
      <div className="grid grid-cols-7 gap-6">
        <MainCard
          className="col-span-full lg:col-span-4"
          loading={stampsLoading || reverifyLoading}
          icon={HiCheckBadge}
          header={
            <DefaultMainCardHeader
              value={amountOfVerifiedStamps}
              label="verified accounts"
            />
          }
          aside={<ExplanationButton />}
        >
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-wrap gap-6">
              {availableStamps.map((stampInfo) => (
                <StampCard
                  key={stampInfo.id}
                  stampInfo={stampInfo}
                  stamp={stamps.find(([id]) => id === stampInfo.id) || null}
                  thresholdHistory={thresholdHistory ?? []}
                  verify={verify}
                  refetch={refetch}
                  isError={isError}
                />
              ))}
            </div>
          </div>
        </MainCard>

        <div className="col-span-full flex flex-col gap-y-6 lg:col-span-3">
          <MainCard
            loading={false}
            icon={HiOutlineClock}
            header={
              <DefaultMainCardHeader
                value={pendingVerifications.length}
                label="pending verifications"
                truncateMobile
              />
            }
          >
            {pendingVerifications.length > 0 ? (
              pendingVerifications.map(
                (verification: PendingVerification, index: number) => (
                  <PendingVerificationCard
                    verification={verification}
                    refetch={refetch}
                    pendingVerifications={pendingVerifications}
                    setPendingVerifications={setPendingVerifications}
                    key={index}
                  />
                )
              )
            ) : (
              <p className="italic text-highlight-foreground/80">
                No pending verifications
              </p>
            )}
          </MainCard>

          <MainCard
            loading={historyLoading}
            icon={History}
            header={
              <DefaultMainCardHeader
                value={verificationHistory.length}
                label="completed verifications"
                truncateMobile
              />
            }
          >
            {verificationHistory.length > 0 ? (
              <>
                {verificationHistory
                  ?.map((history, index) => (
                    <RecentVerificationCard key={index} history={history} />
                  ))
                  .slice(0, historyLimit)}
                {historyLimit < verificationHistory.length && (
                  <Button
                    variant="outline"
                    label="Show more tokens"
                    icon={HiArrowSmallRight}
                    onClick={() =>
                      setHistoryLimit(historyLimit + Math.min(historyLimit, 25))
                    }
                  />
                )}
              </>
            ) : (
              <p className="italic text-highlight-foreground/80">
                No completed verifications
              </p>
            )}
          </MainCard>
        </div>
      </div>
    </div>
  );
};

/**
 * Button that opens a dialog containg an explanation of how verification works
 * @returns A Dialog component with the explanation as its desription
 */
const ExplanationButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="subtle" label="How does it work?" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How does verification work?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p className="block">
                You can verify your identity on a variety platforms to prove
                that you are a real person. Follow the steps below to verify for
                a specific platform:
              </p>
              <ol className="list-decimal pl-5">
                <li>
                  Click the Verify button on the card of the platform of your
                  choice. This will prompt you to sign a message using your
                  wallet to prove that you own the wallet.
                </li>
                <li>
                  After signing the message, you will be redirected to the login
                  page of the platform (if necessary). When you are logged in,
                  you will be redirected back to this page.
                </li>
                <li>
                  Click the Finish button on the corresponding card in the
                  pending verifications on the right. A transaction will be
                  initiated to store the verification on the blockchain, which
                  you will be asked to sign.
                </li>
                <li>
                  After the transaction is confirmed, you will be verified for
                  that platform!
                </li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <div className="flex items-end justify-end">
            <Button variant="subtle" label="Close" className="self-end" />
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default Verification;
