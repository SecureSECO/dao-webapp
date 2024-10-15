/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDiamondSDKContext } from '@/src/context/DiamondGovernanceSDK';
import { useBalance } from 'wagmi';

export type UseVotingPowerData = {
  loading: boolean;
  error: string | null;
  secoinBalance: bigint | undefined;
};

export type UseVotingPowerProps = {
  address: string | undefined;
  watch?: boolean;
};

/**
 * Hook to fetch the secoin balance of a given wallet
 * @param props.address Address of the wallet to fetch the secoin balance for
 * @param props.watch Whether to watch the balance for changes
 * @returns Object containing the secoin balance, as well as loading and error states
 */
export const useSecoinBalance = ({
  address,
  watch = false,
}: UseVotingPowerProps): UseVotingPowerData => {
  const { secoinAddress } = useDiamondSDKContext();

  const { data, error, isLoading } = useBalance({
    address: address as `0x${string}` | undefined,
    token: secoinAddress as `0x${string}` | undefined,
  });

  return {
    loading: isLoading,
    error: error?.message ?? null,
    secoinBalance: !secoinAddress ? undefined : data?.value,
  };
};
