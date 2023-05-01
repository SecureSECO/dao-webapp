/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ErrorPage from '@/src/pages/ErrorPage';
import Governance from '@/src/pages/Governance';
import Dashboard from '@/src/pages/Dashboard';
import Layout from '@/src/components/layout/Layout';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@/src/index.css';

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
import Settings from '@/src/pages/Settings';
import { AragonSDKWrapper } from '@/src/context/AragonSDK';
import NewProposal from '@/src/pages/NewProposal';
import Verification from '@/src/pages/Verification';
import { Toaster } from '@/src/components/ui/Toaster';
import ViewProposal from '@/src/pages/ViewProposal';
import { ganache } from '@/src/lib/constants/GanacheChain';

// 1. Get projectID at https://cloud.walletconnect.com
if (!import.meta.env.VITE_APP_PROJECT_ID) {
  throw new Error('You need to provide VITE_APP_PROJECT_ID env variable');
}
const projectId = import.meta.env.VITE_APP_PROJECT_ID;

// 2. Configure wagmi client
const chains = [goerli, polygon, ganache];

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
      {
        path: '/finance',
        element: <Finance />,
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
]);

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
