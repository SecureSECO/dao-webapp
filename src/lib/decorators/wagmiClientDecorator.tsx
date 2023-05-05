/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { goerli, polygon } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { w3mConnectors, w3mProvider } from '@web3modal/ethereum';

export const wagmiClientDecorator = (Story: any) => {
  const projectId = import.meta.env.VITE_APP_PROJECT_ID;
  const chains = [goerli, polygon];
  const { provider } = configureChains(chains, [
    import.meta.env.PROD || import.meta.env.VITE_USE_GANACHE !== 'true'
      ? (w3mProvider({ projectId }) as any)
      : // DEV NOTE: This is a local testnet on Ganache. Make sure you have it running
        // on port 65534, and deploy the necessary contracts to it.
        jsonRpcProvider({
          rpc: () => ({
            http: 'http://localhost:65534',
          }),
        }),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ version: 1, chains, projectId }),
    provider,
  });
  return (
    <WagmiConfig client={wagmiClient}>
      <Story />
    </WagmiConfig>
  );
};
