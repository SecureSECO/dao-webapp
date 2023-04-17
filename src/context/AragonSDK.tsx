/**
 * @see https://devs.aragon.org/docs/sdk/examples/ - Aragon SDK Context setup
 * Exports a React Context that provides the Aragon SDK Context and Client.
 * This context is used by the useAragonSDK hook.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import {
  Client,
  Context,
  ContextParams,
  ContextPlugin,
  TokenVotingClient,
} from '@aragon/sdk-client';
import { useProvider, useSigner } from 'wagmi';
import { Contract } from 'ethers';
import { erc20ABI } from 'wagmi';
import { DiamondGovernanceClient } from '@plopmenz/diamond-governance-sdk';

type SDKContext = {
  context?: Context;
  client?: Client;
  votingClient?: DiamondGovernanceClient;
  votingPluginAddress?: string;
  repTokenContract?: Contract;
};

const AragonSDKContext = createContext<SDKContext>({});
const votingPluginAddress = '0x6f8029BbB95E290cDCeFBf9Feb0b53bed427229C';
const repTokenAddress = '0x6f8029BbB95E290cDCeFBf9Feb0b53bed427229C';

export function AragonSDKWrapper({ children }: any): JSX.Element {
  const [context, setContext] = useState<Context | undefined>(undefined);
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [votingClient, setVotingClient] = useState<
    DiamondGovernanceClient | undefined
  >(undefined);
  const [repTokenContract, setRepTokenContract] = useState<
    Contract | undefined
  >(undefined);

  const signer = useSigner().data || undefined;
  const provider = useProvider({
    chainId: import.meta.env.VITE_PREFERRED_NETWORK_ID,
  });

  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: 'goerli',
      signer,
      daoFactoryAddress: '0x16B6c6674fEf5d29C9a49EA68A19944f5a8471D3', // Check active addresses here: https://github.com/aragon/osx/blob/develop/active_contracts.json
      web3Providers: ['https://rpc.ankr.com/eth_goerli'],
      ipfsNodes: [
        {
          url: 'https://testing-ipfs-0.aragon.network/api/v0',
          headers: { 'X-API-KEY': import.meta.env.VITE_IPFS_KEY || '' },
        },
      ],
      graphqlNodes: [
        {
          url: 'https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-goerli/version/v1.1.0/api', //'https://subgraph.plopmenz.com/subgraphs/name/PlopGraph/version/v0.0.1/api'
        },
      ],
    };

    setContext(new Context(aragonSDKContextParams));
  }, [signer]);

  useEffect(() => {
    if (!context || !signer) return;
    setClient(new Client(context));
    // const contextPlugin = ContextPlugin.fromContext(context);
    setVotingClient(new DiamondGovernanceClient(votingPluginAddress, signer));
  }, [context, signer]);

  useEffect(() => {
    setRepTokenContract(new Contract(repTokenAddress, erc20ABI, provider));
  }, [provider]);

  return (
    <AragonSDKContext.Provider
      value={{
        context,
        client,
        votingClient,
        votingPluginAddress,
        repTokenContract,
      }}
    >
      {children}
    </AragonSDKContext.Provider>
  );
}

export function useAragonSDKContext(): SDKContext {
  return useContext(AragonSDKContext);
}
