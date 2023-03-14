// src/context/AragonSDK.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import { Context, ContextParams } from '@aragon/sdk-client';
import { useSigner } from 'wagmi';

const AragonSDKContext = createContext({});

export function AragonSDKWrapper({ children }: any): JSX.Element {
  const [context, setContext] = useState<Context | undefined>(undefined);
  const signer = useSigner().data || undefined;

  // TODO: Add support for Polygon
  useEffect(() => {
    const aragonSDKContextParams: ContextParams = {
      network: import.meta.env.DEV ? 'goerli' : 'polygon',
      signer,
      daoFactoryAddress: import.meta.env.DEV
        ? '0x16B6c6674fEf5d29C9a49EA68A19944f5a8471D3'
        : '', // Check active addresses here: https://github.com/aragon/osx/blob/develop/active_contracts.json
      web3Providers: ['https://rpc.ankr.com/eth_goerli'], // feel free to use the provider of your choosing: Alchemy, Infura, etc.
      ipfsNodes: [
        {
          url: 'https://testing-ipfs-0.aragon.network/api/v0',
          headers: { 'X-API-KEY': process.env.VITE_IPFS_KEY || '' }, // make sure you have the key for your IPFS node within your .env file
        },
      ],
      graphqlNodes: [
        {
          url: 'https://subgraph.satsuma-prod.com/aragon/core-goerli/api', // this will change based on the chain you're using
        },
      ],
    };

    setContext(new Context(aragonSDKContextParams));
  }, [signer]);

  return (
    <AragonSDKContext.Provider value={{ context }}>
      {children}
    </AragonSDKContext.Provider>
  );
}

export function useAragonSDKContext(): any {
  return useContext(AragonSDKContext);
}
