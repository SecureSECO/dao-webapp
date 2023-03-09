import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, polygon } from 'wagmi/chains';

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.REACT_APP_PROJECT_ID) {
  throw new Error('You need to provide REACT_APP_PROJECT_ID env variable');
}
const projectId = process.env.REACT_APP_PROJECT_ID;

// 2. Configure wagmi client
const chains = [polygon, goerli];

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }) as any,
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'SecureSecoDao', chains }) as any,
  provider,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </React.StrictMode>
);
