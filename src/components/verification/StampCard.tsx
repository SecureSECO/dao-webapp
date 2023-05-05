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
import {
  HiCalendar,
  HiChartBar,
  HiLink,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
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
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { verificationAbi } from '@/src/assets/verificationAbi';
import { useState } from 'react';
import DoubleCheck from '@/src/components/icons/DoubleCheck';
import { HiXMark, HiOutlineClock } from 'react-icons/hi2';
import { useToast } from '@/src/hooks/useToast';
import ConnectWalletWarning from '@/src/components/ui/ConnectWalletWarning';
import Header from '@/src/components/ui/Header';
import { format } from 'date-fns';

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
 * @param {string} props.stampInfo - Information about the stamp (e.g. GitHub icon, and link to GitHub website)
 * @param {Stamp | null} props.stamp - The stamp object, or null if there is no stamp
 * @param {(providerId: string) => void} props.verify - Callback to verify the stamp
 * @returns A Card element containing information about the provided stamp
 */
const StampCard = ({
  stampInfo,
  stamp,
  thresholdHistory,
  verify,
  refetch,
  isError,
}: {
  stampInfo: StampInfo;
  stamp: Stamp | null;
  thresholdHistory: VerificationThreshold[];
  // eslint-disable-next-line no-unused-vars
  verify: (providerId: string) => void;
  refetch: () => void;
  isError: boolean;
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
  const { isConnected } = useAccount();

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
    <Card variant="light" className="flex flex-col gap-y-2">
      {isConnected && (
        <StatusBadge
          {...getStatusProps(verified, expired)}
          className="xs:hidden"
        />
      )}
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          {stampInfo.icon}
          <Header level={2}>{stampInfo.displayName}</Header>
        </div>
        {isConnected && (
          <StatusBadge
            {...getStatusProps(verified, expired)}
            className="hidden xs:flex"
          />
        )}
      </div>
      <div className="flex flex-col gap-y-1 text-base">
        <div className="flex w-full flex-row items-center gap-x-2 text-popover-foreground">
          <HiLink className="h-5 w-5 shrink-0" />
          <p className="max-w-full truncate font-normal">
            <a
              href={stampInfo.url}
              target="_blank"
              rel="noreferrer"
              className="mx-1 rounded-sm text-primary-highlight outline-ring transition-colors duration-200 hover:text-primary-highlight/80"
            >
              {stampInfo.url}
            </a>
          </p>
        </div>
        {stamp && stamp[2] && stamp[2].length > 0 && (
          <>
            <div className="flex items-center gap-x-2 text-popover-foreground">
              <HiCalendar className="h-5 w-5 shrink-0" />
              <p className="font-normal">
                {/* Last verified at:{' '} */}
                {format(
                  new Date(stamp[2][stamp[2].length - 1].toNumber() * 1000),
                  'Pp'
                )}
              </p>
            </div>
            {verified && timeLeftUntilExpiration != null && (
              <div
                className={`flex items-center gap-x-2 ${
                  expired || timeLeftUntilExpiration / 86400 < 7
                    ? 'text-destructive'
                    : 'text-popover-foreground'
                }`}
              >
                <div className="flex h-5 w-5 items-center justify-center">
                  <HiOutlineClock className="h-5 w-5 shrink-0" />
                </div>
                <p className="font-normal">
                  {Math.max(0, timeLeftUntilExpiration / 86400).toFixed(0)} days
                  until expiration
                </p>
              </div>
            )}
            <div className="flex items-center gap-x-2 text-popover-foreground">
              <HiChartBar className="h-5 w-5 shrink-0" />
              <p className="font-normal">
                {/* Last verified at:{' '} */}
                Verified {stamp[2].length} time{stamp[2].length > 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-row items-center gap-x-4">
          <Button
            disabled={!isConnected || isError}
            onClick={() => verify(providerId)}
          >
            {verified ? 'Reverify' : 'Verify'}
          </Button>
          {!isConnected && <ConnectWalletWarning action="to verify" />}
          {isError && isConnected && (
            <div className="flex flex-row items-center gap-x-1 text-destructive opacity-80">
              <HiOutlineExclamationCircle className="h-5 w-5 shrink-0" />
              <p className="leading-4">
                An error occurred, please try again later
              </p>
            </div>
          )}
        </div>

        {verified && isConnected && !isError && (
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
                      loading: 'Removing verification...',
                      success: 'Verification removed',
                      error: (err) => ({
                        title: 'Failed to remove verification: ',
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
