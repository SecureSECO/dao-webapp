import { Button } from '@/src/components/ui/Button';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount, useContractRead, useSignMessage } from 'wagmi';
import { verificationAbi } from '../assets/verificationAbi';
import StampCard from '../components/ui/StampCard';
import { apiUrl } from '../main';
import { Stamp } from '../types/Stamp';

const FinishVerification = () => {
  const { address } = useAccount();

  const { data, isError, error, isLoading } = useContractRead({
    address: '0xD547BC6bc09D8778a95F7dB378eA4b6E5b79885e',
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
      <HeaderCard title="Finish Verification" aside={<></>}></HeaderCard>
    </div>
  );
};

export default FinishVerification;
