import { Button } from '@/src/components/ui/Button';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount, useContractRead, useSignMessage } from 'wagmi';
import { verificationAbi } from '../assets/verificationAbi';
import StampCard from '../components/ui/StampCard';
import { apiUrl, verificationContractAddress } from '../main';
import { Stamp } from '../types/Stamp';

const availableStamps = ['proofofhumanity', 'github', 'twitter'];

const Verification = () => {
  const { address } = useAccount();

  const { data, isError, error, isLoading } = useContractRead({
    address: verificationContractAddress,
    abi: verificationAbi,
    functionName: 'getStamps',
    args: [address],
  });

  const { signMessage } = useSignMessage({
    onError(error) {
      toast.error(error.message.substr(0, 100));
    },
    async onSuccess(data) {
      try {
        // Send the signature to the API
        const response = await fetch(`${apiUrl}/verify`, {
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
  const [nonce, setNonce] = useState<number>(0);
  const [providerId, setProviderId] = useState<string>('');

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const stamps: Stamp[] = data.map((stamp: any) => [
        stamp.id,
        stamp._hash,
        Number(stamp.verifiedAt),
      ]);

      setStamps(stamps);
    }
  }, [data]);

  const verify = async (providerId: string) => {
    try {
      // Check if the account has already verified
      const stamp = stamps.find(([id]) => id === providerId);
      if (stamp) {
        const [, , verifiedAt] = stamp;
        // Check if it has been more than 30 days
        if (verifiedAt * 1000 + 30 * 24 * 60 * 60 * 1000 > Date.now()) {
          throw new Error(
            'You have already verified with this provider, please wait at least 30 days after the initial verification to verify again.'
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
            <p>
              You can verify your identity on other platforms to prove that you
              are a real person.
            </p>
            <div className="flex flex-wrap gap-6">
              {availableStamps.map((providerId) => (
                <StampCard
                  key={providerId}
                  providerId={providerId}
                  stamp={stamps.find(([id]) => id === providerId) || null}
                  verify={verify}
                />
              ))}
            </div>
          </div>
        )}
      </HeaderCard>
    </div>
  );
};

export default Verification;
