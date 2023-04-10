import { goerli, polygon } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { w3mConnectors, w3mProvider } from '@web3modal/ethereum';

export const addWagmiClientDecorator = (Story: any) => {
  const projectId = import.meta.env.VITE_APP_PROJECT_ID;
  const chains = [goerli, polygon];
  const { provider } = configureChains(chains, [
    import.meta.env.PROD
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
