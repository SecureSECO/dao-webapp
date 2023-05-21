/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @see https://github.com/SecureSECODAO/diamond-governance/tree/dev/sdk - Diamond Governance SDK Context setup
 * Exports a React Context that provides a client for the Diamond Governance SDK.
 * This context is used by the useDiamondSDKContext hook.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { Contract, ethers } from 'ethers';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { siteConfig } from '@/src/lib/constants/config';

type SDKContext = {
  client?: DiamondGovernanceClient;
  repTokenContract?: Contract;
};

const DiamondSDKContext = createContext<SDKContext>({});
const diamondAddress = siteConfig.VITE_DIAMOND_ADDRESS;

export function DiamondSDKWrapper({ children }: any): JSX.Element {
  const [client, setClient] = useState<DiamondGovernanceClient | undefined>(
    undefined
  );

  const signer = useSigner().data || undefined;

  // Make sure the user is on the correct network
  const network = useSwitchNetwork({
    chainId: PREFERRED_NETWORK_METADATA.id,
  });
  const { chain } = useNetwork();
  if (
    chain?.id !== PREFERRED_NETWORK_METADATA.id &&
    network.switchNetwork &&
    !network.isLoading
  ) {
    network.switchNetwork();
  }

  useEffect(() => {
    // If no signer is available, use a dummy signer
    // All operations that actually require a signer should be blocked anwyways
    if (!signer) {
      let jsonRpcProvider = new ethers.providers.JsonRpcProvider(
        'https://rpc.ankr.com/polygon_mumbai',
        {
          chainId: PREFERRED_NETWORK_METADATA.id,
          name: PREFERRED_NETWORK_METADATA.name,
        }
      );
      let dummySigner = jsonRpcProvider.getSigner(
        '0x0000000000000000000000000000000000000000'
      );
      setClient(new DiamondGovernanceClient(diamondAddress, dummySigner));
      return;
    }
    setClient(new DiamondGovernanceClient(diamondAddress, signer));
  }, [signer]);

  return (
    <DiamondSDKContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </DiamondSDKContext.Provider>
  );
}

export function useDiamondSDKContext(): SDKContext {
  return useContext(DiamondSDKContext);
}
