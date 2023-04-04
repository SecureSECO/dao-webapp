import ErrorPage from './pages/ErrorPage';
import Governance from './pages/Governance';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, polygon } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import Finance from '@/src/pages/Finance';
import Community from '@/src/pages/Community';
import Settings from '@/src/pages/Settings';
import { AragonSDKWrapper } from '@/src/context/AragonSDK';
import NewProposal from '@/src/pages/NewProposal';
import Verification from './pages/Verification';
import { Toaster } from 'react-hot-toast';
import ViewProposal from '@/src/pages/ViewProposal';

// 1. Get projectID at https://cloud.walletconnect.com
if (!import.meta.env.VITE_APP_PROJECT_ID) {
  throw new Error('You need to provide VITE_APP_PROJECT_ID env variable');
}
const projectId = import.meta.env.VITE_APP_PROJECT_ID;

// 2. Configure wagmi client
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

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    id: 'root',
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: '/governance',
        children: [
          {
            path: '',
            children: [
          {
            path: '',
            element: <Governance />,
              },
              {
                path: '/governance/new-proposal',
                element: <NewProposal />,
              },
          {
            path: '/governance/proposals/:id',
            element: <ViewProposal />,
          },
        ],
      },
        ],
      },
      {
        path: '/finance',
        element: <Finance />,
      },
      {
        path: '/community',
        element: <Community />,
      },
      {
        path: '/verification',
        element: <Verification />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  // If you need a route without the layout, add another object here
]);

export const apiUrl = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster />
    <WagmiConfig client={wagmiClient}>
      <AragonSDKWrapper>
        <RouterProvider router={router} />
      </AragonSDKWrapper>
    </WagmiConfig>

    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode={'dark'}
    />
  </React.StrictMode>
);
