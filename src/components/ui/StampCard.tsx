/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The StampCard component displays information about a specific stamp.
 * It shows the providerId, the last verified date, and a button to verify or reverify the stamp.
 * If the stamp is verified, a checkmark icon will be displayed next to the providerId.
 */

import {
  Stamp,
  StampInfo,
  VerificationThreshold,
  isVerified,
} from '@/src/pages/Verification';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { HiCalendar, HiChartBar, HiLink } from 'react-icons/hi2';
import { FaHourglass } from 'react-icons/fa';
import { StatusBadge, StatusBadgeProps } from '@/src/components/ui/StatusBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/AlertDialog';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { verificationAbi } from '@/src/assets/verificationAbi';
import { useState } from 'react';
import DoubleCheck from '@/src/components/icons/DoubleCheck';
import { HiXMark, HiOutlineClock } from 'react-icons/hi2';
import { useToast } from '@/src/hooks/useToast';

/**
 * Derives the status badge props from the stamp's verification status
 * @param verified A boolean indicating whether the stamp is verified
 * @param expired A boolean indicating whether the stamp is expired
 * @returns A StatusBadgeProps object
 */
const getStatusProps = (
  verified: boolean,
  expired: boolean
): StatusBadgeProps => {
  if (verified)
    return {
      icon: DoubleCheck,
      variant: 'success',
      text: 'Verified',
    };

  if (expired)
    return {
      icon: HiOutlineClock,
      text: 'Expired',
      variant: 'destructive',
    };

  return {
    icon: HiXMark,
    text: 'Unverified',
    variant: 'secondary',
  };
};

/**
 * @param {Object} props - The properties for the StampCard component.
 * @param {string} props.providerId - The providerId for the stamp.
 * @param {Stamp | null} props.stamp - The stamp object, or null if there is no stamp.
 * @param {(providerId: string) => void} props.verify - Callback to verify the stamp.
 * @returns A StampCard React element.
 */
const StampCard = ({
  stampInfo,
  stamp,
  thresholdHistory,
  verify,
  refetch,
}: {
  stampInfo: StampInfo;
  stamp: Stamp | null;
  thresholdHistory: VerificationThreshold[];
  // eslint-disable-next-line no-unused-vars
  verify: (providerId: string) => void;
  refetch: () => void;
}) => {
  const {
    verified,
    expired,
    timeLeftUntilExpiration,
  }: {
    verified: boolean;
    expired: boolean;
    timeLeftUntilExpiration: number | null;
  } = isVerified(thresholdHistory, stamp);
  const { promise: promiseToast } = useToast();

  const providerId = stampInfo.id;

  const [isBusy, setIsBusy] = useState(false);

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_VERIFY_CONTRACT,
    abi: verificationAbi,
    functionName: 'unverify',
    args: [providerId],
  });

  const { writeAsync } = useContractWrite(config);

  /**
   * Deletes the stamp from this specific provider
   * @returns {Promise<void>} Promise that resolves when the stamp is deleted
   */
  const unverify = async (): Promise<void> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if (isBusy) {
          return reject('Already unverifying');
        }

        setIsBusy(true);

        if (!writeAsync) {
          setIsBusy(false);
          return reject('Contract write not ready');
        }

        const txResult = await writeAsync();

        console.log('txResult', txResult);

        txResult
          .wait()
          .then(() => {
            console.log('Successfully unverified');
            resolve();
          })
          .catch((error: any) => {
            console.error(
              'StampCard ~ unverify ~ txResult.catch ~ Unverification failed',
              error
            );
            reject('Transaction failed');
          });
      } catch (error: any) {
        console.error(
          'StampCard ~ unverify ~ try/catch ~ Unverification failed',
          error
        );
        setIsBusy(false);
        reject('Unverification failed');
      }
    });
  };

  return (
    <Card
      padding="sm"
      variant="light"
      className="flex flex-col gap-y-2 p-4 font-normal"
    >
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          {stampInfo.icon}
          <h2 className="text-xl font-semibold">{stampInfo.displayName}</h2>
        </div>
        <StatusBadge {...getStatusProps(verified, expired)} />
      </div>
      <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
        <HiLink />
        <p className="font-normal">
          {/* Url:{' '} */}
          <a
            href={stampInfo.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            {stampInfo.url}
          </a>
        </p>
      </div>
      {stamp && stamp[2] && stamp[2].length > 0 && (
        <>
          <div className="flex items-center gap-x-6">
            <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
              <HiCalendar />
              <p className="font-normal">
                {/* Last verified at:{' '} */}
                {new Date(
                  stamp[2][stamp[2].length - 1].toNumber() * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            {verified && timeLeftUntilExpiration != null && (
              <div
                className={`flex items-center gap-x-2 ${
                  expired || timeLeftUntilExpiration / 86400 < 7
                    ? 'text-destructive'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FaHourglass size={14} />
                <p className="font-normal">
                  {Math.max(0, timeLeftUntilExpiration / 86400).toFixed(1)} days
                  until expiration
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-2 text-slate-600 dark:text-slate-400">
            <HiChartBar />
            <p className="font-normal">
              {/* Last verified at:{' '} */}
              Verified {stamp[2].length} time{stamp[2].length > 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button onClick={() => verify(providerId)}>
          {verified ? 'Reverify' : 'Verify'}
        </Button>

        {verified && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="subtle">Remove</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your stamp from the blockchain.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isBusy}
                  onClick={() => {
                    const promise = unverify();
                    promiseToast(promise, {
                      loading: 'Removing stamp...',
                      success: 'Stamp removed',
                      error: (err) => ({
                        title: 'Failed to remove stamp: ',
                        description: err,
                      }),
                    });

                    promise.finally(() => {
                      setIsBusy(false);
                      refetch();
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Card>
  );
};

export default StampCard;
