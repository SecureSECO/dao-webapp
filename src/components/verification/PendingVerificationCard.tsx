/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview PendingVerificationCard - Component that displays information about an ongoing verification
 * Contains a button to verify, and additional information about the verification
 */

import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import CategoryList, { Category } from '@/src/components/ui/CategoryList';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/Dialog';
import Header from '@/src/components/ui/Header';
import { toast } from '@/src/hooks/useToast';
import {
  PendingVerification,
  StampInfo,
  useVerification,
} from '@/src/hooks/useVerification';
import { truncateMiddle } from '@/src/lib/utils';
import { availableStamps } from '@/src/pages/Verification';
import { ContractTransaction } from 'ethers';
import { HiOutlineClock, HiQuestionMarkCircle } from 'react-icons/hi2';

/**
 * @returns A Card element containing information about a previous verification
 */
const PendingVerificationCard = ({
  verification,
  refetch,
  pendingVerifications,
  setPendingVerifications,
}: {
  verification: PendingVerification;
  refetch: () => void;
  pendingVerifications: PendingVerification[];
  setPendingVerifications: (
    // eslint-disable-next-line no-unused-vars
    pendingVerifications: PendingVerification[]
  ) => void;
}) => {
  const fallBackStampInfo = {
    id: 'unknown',
    displayName: 'Unknown',
    url: 'https://www.google.com',
    icon: <HiQuestionMarkCircle />,
  } as StampInfo;

  // Find the stamp info for the verification
  const stampId = verification.providerId;
  const stampInfo: StampInfo =
    availableStamps.find((stampInfo) => stampInfo.id === stampId) ??
    fallBackStampInfo;

  const { addressToVerify, hash, timestamp, providerId, sig } = verification;

  const [isBusy, setIsBusy] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { verify: sdkVerify } = useVerification();

  // We calculate how much time is left for the verification to expire
  const timeLeft = Math.max(
    0,
    // 1 hour to verify
    parseInt(timestamp ?? '') + 3600 - Math.floor(Date.now() / 1000)
  );

  /**
   * Actually makes a write call to the contract to verify the address
   * @returns {Promise<ContractTransaction>} Promise that resolves when the verification settles
   */
  const verify = async (): Promise<ContractTransaction> => {
    // Check if verification is still valid
    if (timeLeft <= 0) {
      setPendingVerifications(
        pendingVerifications.filter(
          (pendingVerification) => pendingVerification.hash !== hash
        )
      );
      throw new Error('Verification expired');
    }

    setIsBusy(true);

    return await sdkVerify(
      addressToVerify,
      hash,
      Number(timestamp),
      providerId,
      sig
    );
  };

  // Creates categories from verification fields
  function getCategories(verification: PendingVerification): Category[] {
    return [
      {
        title: 'Details',
        items: [
          {
            label: 'Address',
            value: truncateMiddle(verification.addressToVerify, 16),
          },
          {
            label: 'Hash',
            value: truncateMiddle(verification.hash, 16),
          },
          {
            label: 'Timestamp',
            value: verification.timestamp,
          },
          {
            label: 'Signature',
            value: truncateMiddle(verification.sig, 16),
          },
          {
            label: 'Provider',
            value: (
              <span className="capitalize">{verification.providerId}</span>
            ),
          },
        ],
      },
    ];
  }

  return (
    <Card variant="light" className="flex flex-col gap-y-2 font-normal">
      <div className="flex items-center gap-x-2">
        {stampInfo.icon}
        <Header level={3}>{stampInfo.displayName}</Header>
      </div>
      <div className="flex items-center gap-x-2 text-popover-foreground/80">
        <HiOutlineClock className="h-5 w-5 shrink-0" />
        <p className="font-normal">
          {timeLeft > 0
            ? `Expires in ${Math.floor(timeLeft / 60)} minutes`
            : 'Expired'}
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => {
            toast.contractTransaction(verify, {
              success: 'Successfully verified!',
              error: (e) => ({
                title: 'Verification failed',
              }),
              onSuccess: () => {
                setIsSuccess(true);
                // Remove from pendingVerifications
                setPendingVerifications(
                  pendingVerifications.filter(
                    (pendingVerification) => pendingVerification.hash !== hash
                  )
                );
              },
              onFinish() {
                setIsBusy(false);

                refetch();
              },
            });
          }}
          disabled={isBusy}
          label={isBusy ? 'Verifying...' : isSuccess ? 'Success' : 'Finish'}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="subtle" label="View details" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verification details</DialogTitle>
              <DialogDescription asChild>
                <CategoryList categories={getCategories(verification)} />
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <div className="flex items-end justify-end">
                <Button variant="subtle" label="Close" className="self-end" />
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default PendingVerificationCard;
