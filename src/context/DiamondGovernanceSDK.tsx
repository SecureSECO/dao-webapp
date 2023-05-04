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
import { erc20ABI, useProvider, useSigner } from 'wagmi';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { Contract } from 'ethers';

type SDKContext = {
  client?: DiamondGovernanceClient;
  repTokenContract?: Contract;
};

const DiamondSDKContext = createContext<SDKContext>({});
const diamondAddress = import.meta.env.VITE_DIAMOND_ADDRESS;

export function DiamondSDKWrapper({ children }: any): JSX.Element {
  const [client, setClient] = useState<DiamondGovernanceClient | undefined>(
    undefined
  );
  const [repTokenContract, setRepTokenContract] = useState<
    Contract | undefined
  >(undefined);

  const signer = useSigner().data || undefined;
  const provider = useProvider({
    chainId: +import.meta.env.VITE_PREFERRED_NETWORK_ID,
  });

  useEffect(() => {
    if (!signer) return;
    setClient(new DiamondGovernanceClient(diamondAddress, signer));
  }, [signer]);

  useEffect(() => {
    setRepTokenContract(new Contract(diamondAddress, erc20ABI, provider));
  }, [provider]);

  return (
    <DiamondSDKContext.Provider
      value={{
        client,
        repTokenContract,
      }}
    >
      {children}
    </DiamondSDKContext.Provider>
  );
}

export function useDiamondSDKContext(): SDKContext {
  return useContext(DiamondSDKContext);
}
