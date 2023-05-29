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
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';
import { CONFIG } from '@/src/lib/constants/config';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';

type SDKContext = {
  client?: DiamondGovernanceClient;
  daoAddress?: string;
  secoinAddress?: string;
};

const DiamondSDKContext = createContext<SDKContext>({});
const diamondAddress = CONFIG.DIAMOND_ADDRESS;

export function DiamondSDKWrapper({ children }: any): JSX.Element {
  const [client, setClient] = useState<DiamondGovernanceClient | undefined>(
    undefined
  );
  const [daoAddress, setDaoAddress] = useState<string | undefined>(undefined);
  const [secoinAddress, setSecoinAddress] = useState<string | undefined>(
    undefined
  );

  const signer = useSigner().data || undefined;

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

  useEffect(() => {
    const getDaoAddress = async () => {
      if (!client) return;
      const daoRef = await client.pure.IDAOReferenceFacet();
      const daoAddressData = await daoRef.dao();
      setDaoAddress(daoAddressData);
    };

    const getSecoinAddress = async () => {
      if (!client) return;
      const IChangeableTokenContract =
        await client.pure.IChangeableTokenContract();
      const monetaryTokenContractAddress =
        await IChangeableTokenContract.getTokenContractAddress();
      setSecoinAddress(monetaryTokenContractAddress);
    };

    getDaoAddress();
    getSecoinAddress();
  }, [client]);

  return (
    <DiamondSDKContext.Provider
      value={{
        client,
        daoAddress,
        secoinAddress,
      }}
    >
      {children}
    </DiamondSDKContext.Provider>
  );
}

export function useDiamondSDKContext(): SDKContext {
  return useContext(DiamondSDKContext);
}
