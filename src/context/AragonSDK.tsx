/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
  TokenVotingClient,
} from '@aragon/sdk-client';
import { useSigner } from 'wagmi';
import { PREFERRED_NETWORK_METADATA } from '@/src/lib/constants/chains';

type SDKContext = {
  context?: Context;
  client?: Client;
  votingClient?: TokenVotingClient;
  votingPluginAddress?: string;
};

const AragonSDKContext = createContext<SDKContext>({});

export function AragonSDKWrapper({ children }: any): JSX.Element {
  const [context, setContext] = useState<Context | undefined>(undefined);
  const [client, setClient] = useState<Client | undefined>(undefined);

  const signer = useSigner().data || undefined;

  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: {
        chainId: PREFERRED_NETWORK_METADATA.id,
        name: PREFERRED_NETWORK_METADATA.name,
      },
      signer,
      daoFactoryAddress: '0x3ff1681f31f68Ff2723d25Cf839bA7500FE5d218', // Check active addresses here: https://github.com/aragon/osx/blob/develop/active_contracts.json
      web3Providers: ['https://rpc.ankr.com/polygon_mumbai'],
      ipfsNodes: [
        {
          url: 'https://ipfs-0.aragon.network/api/v0',
          headers: { 'X-API-KEY': import.meta.env.VITE_IPFS_KEY || '' },
        },
      ],
      graphqlNodes: [
        {
          url: 'https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-mumbai/api',
        },
      ],
    };
    console.log(aragonSDKContextParams);

    setContext(new Context(aragonSDKContextParams));
  }, [signer]);

  useEffect(() => {
    if (!context || !signer) return;
    setClient(new Client(context));
  }, [context, signer]);

  return (
    <AragonSDKContext.Provider
      value={{
        context,
        client,
      }}
    >
      {children}
    </AragonSDKContext.Provider>
  );
}

export function useAragonSDKContext(): SDKContext {
  return useContext(AragonSDKContext);
}
