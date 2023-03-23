import { Button } from '@/src/components/ui/Button';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSignMessage,
  useWaitForTransaction,
} from 'wagmi';
import { verificationAbi } from '../assets/verificationAbi';
import StampCard from '../components/ui/StampCard';
import { apiUrl, verificationContractAddress } from '../main';
import { Stamp } from '../types/Stamp';

const FinishVerification = () => {
  const { address } = useAccount();

  const [searchParams] = useSearchParams();
  const addressToVerify = searchParams.get('address');
  const hash = searchParams.get('hash');
  const timestamp = searchParams.get('timestamp');
  const providerId = searchParams.get('providerId');
  const sig = searchParams.get('sig');

  const {
    config,
    isError: isPrepareError,
    error: prepareError,
  } = usePrepareContractWrite({
    address: verificationContractAddress,
    abi: verificationAbi,
    functionName: 'verifyAddress',
    args: [addressToVerify, hash, parseInt(timestamp ?? ''), providerId, sig],
  });

  const { data, writeAsync: write } = useContractWrite(config);

  const { isLoading, isSuccess, isError, error } = useWaitForTransaction({
    hash: data?.hash,
  });

  const verify = async (): Promise<void> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!write) {
        return reject('Contract write not ready');
      }

      const txResult = await write();
      txResult
        .wait()
        .then(() => {
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  };

  const VerificationItem = ({
    title,
    value,
  }: {
    title: string;
    value: string | null;
  }) => {
    return (
      <div>
        <h3>{title}</h3>
        <p className="break-words font-light">{value ?? 'Unknown'}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard title="Finish Verification" aside={<></>}>
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl">Verification Info</h2>
          <div className="flex flex-col gap-4">
            <VerificationItem title="Address" value={addressToVerify} />
            <VerificationItem title="Hash" value={hash} />
            <VerificationItem title="Timestamp" value={timestamp} />
            <VerificationItem title="Provider" value={providerId} />
            <VerificationItem title="Signature" value={sig} />
          </div>

          <div>
            <Button
              className="mt-4"
              onClick={() => {
                toast.promise(verify(), {
                  loading: 'Verifying, please wait...',
                  success: 'Successfully verified!',
                  error: 'Verification failed',
                });
              }}
              disabled={!write || isLoading || isSuccess || isPrepareError}
            >
              {isLoading
                ? 'Verifying...'
                : isSuccess
                ? 'Transaction Sent'
                : isError
                ? 'Verification failed: ' + error?.message
                : 'Verify Account'}
            </Button>
          </div>
          <div>{data?.hash && <p>Transaction hash: {data.hash}</p>}</div>
          {(isPrepareError || isError) && (
            <div>
              <p>Verification Error</p>
              <code>
                {(prepareError as any)?.data?.message ?? 'Unknown error'}
              </code>
              <code>{error?.message}</code>
            </div>
          )}
          {isSuccess && (
            <a href="/verification" className="text-blue-500">
              Go back to stamps
            </a>
          )}
        </div>
      </HeaderCard>
    </div>
  );
};

export default FinishVerification;
