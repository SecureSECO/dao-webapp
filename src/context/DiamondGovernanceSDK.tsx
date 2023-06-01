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
  /** Signed client to be used in requests that require a wallet to be connected */
  client?: DiamondGovernanceClient;
  /** Anonymous client to be used in requests that do not require  */
  anonClient?: DiamondGovernanceClient;
  daoAddress?: string;
  secoinAddress?: string;
};

const DiamondSDKContext = createContext<SDKContext>({});
const diamondAddress = CONFIG.DIAMOND_ADDRESS;

export function DiamondSDKWrapper({ children }: any): JSX.Element {
  const [anonClient, setAnonClient] = useState<
    DiamondGovernanceClient | undefined
  >(undefined);
  const [client, setClient] = useState<DiamondGovernanceClient | undefined>(
    undefined
  );
  const [daoAddress, setDaoAddress] = useState<string | undefined>(undefined);
  const [secoinAddress, setSecoinAddress] = useState<string | undefined>(
    undefined
  );

  const signer = useSigner().data || undefined;

  useEffect(() => {
    // Create client with dummy signer
    let jsonRpcProvider = new ethers.providers.JsonRpcProvider(
      PREFERRED_NETWORK_METADATA.rpc,
      {
        chainId: PREFERRED_NETWORK_METADATA.id,
        name: PREFERRED_NETWORK_METADATA.name,
      }
    );
    let dummySigner = jsonRpcProvider.getSigner(
      '0x0000000000000000000000000000000000000000'
    );
    setAnonClient(new DiamondGovernanceClient(diamondAddress, dummySigner));
  }, []);

  useEffect(() => {
    // Set signed client when signer is available
    if (signer) {
      setClient(new DiamondGovernanceClient(diamondAddress, signer));
      anonClient?.UpdateSigner(signer);
    }
  }, [signer]);

  useEffect(() => {
    const getDaoAddress = async () => {
      if (!anonClient) return;
      const daoRef = await anonClient.pure.IDAOReferenceFacet();
      const daoAddressData = await daoRef.dao();
      setDaoAddress(daoAddressData);
    };

    const getSecoinAddress = async () => {
      if (!anonClient) return;
      const IChangeableTokenContract =
        await anonClient.pure.IChangeableTokenContract();
      const monetaryTokenContractAddress =
        await IChangeableTokenContract.getTokenContractAddress();
      setSecoinAddress(monetaryTokenContractAddress);
    };

    getDaoAddress();
    getSecoinAddress();
  }, [anonClient]);

  return (
    <DiamondSDKContext.Provider
      value={{
        client,
        anonClient,
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
