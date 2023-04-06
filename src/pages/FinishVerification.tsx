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
import { Stamp } from '../pages/Verification';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { HiExclamationCircle } from 'react-icons/hi2';

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
    address: import.meta.env.VITE_VERIFY_CONTRACT,
    abi: verificationAbi,
    functionName: 'verifyAddress',
    args: [addressToVerify, hash, parseInt(timestamp ?? ''), providerId, sig],
  });

  const { data, writeAsync: write } = useContractWrite(config);

  const { isLoading, isSuccess, isError, error } = useWaitForTransaction({
    hash: data?.hash,
  });

  const [isBusy, setIsBusy] = useState(false);

  /**
   * Actually makes a write call to the contract to verify the address
   * @returns {Promise<void>} Promise that resolves when the verification settles
   */
  const verify = async (): Promise<void> => {
    setIsBusy(true);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!write) {
        setIsBusy(false);
        return reject('Contract write not ready');
      }

      console.log('Verifying...');

      try {
        const txResult = await write();

        console.log('txResult', txResult);

        txResult
          .wait()
          .then(() => {
            console.log('Verification successful');
            setIsBusy(false);
            resolve();
          })
          .catch((error: any) => {
            console.error(
              'FinishVerifcation ~ verify ~ txResult.catch ~ Verification failed',
              error
            );
            setIsBusy(false);
            reject(error);
          });
      } catch (error) {
        console.error(error);
        setIsBusy(false);
        reject(error);
      }
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
        <h3 className="font-medium">{title}</h3>
        <p className="break-words font-light">{value ?? 'Unknown'}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <HeaderCard title="Finish Verification" aside={<></>}>
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-medium">Verification Info</h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="verificationInfo">
              <AccordionTrigger className="flex items-center justify-between">
                <h3 className="font-medium">Show Details</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4">
                  <VerificationItem
                    title="Contract Address"
                    value={import.meta.env.VITE_VERIFY_CONTRACT}
                  />
                  <VerificationItem title="Address" value={addressToVerify} />
                  <VerificationItem title="Hash" value={hash} />
                  <VerificationItem title="Timestamp" value={timestamp} />
                  <VerificationItem title="Provider" value={providerId} />
                  <VerificationItem title="Signature" value={sig} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div>
            <Button
              className="mt-4"
              onClick={() => {
                toast.promise(verify(), {
                  loading: 'Verifying, please wait...',
                  success: 'Successfully verified!',
                  error: (e) => 'Verification failed: ' + e.message,
                });
              }}
              disabled={
                !write || isBusy || isLoading || isSuccess || isPrepareError
              }
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
              <div className="mb-2 flex items-center gap-x-2 text-red-400">
                <HiExclamationCircle />
                <p>Verification Error</p>
              </div>
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
