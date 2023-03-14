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
import Finance from '@/src/pages/Finance';
import Community from '@/src/pages/Community';
import Settings from '@/src/pages/Settings';

// 1. Get projectID at https://cloud.walletconnect.com
if (!import.meta.env.VITE_APP_PROJECT_ID) {
  throw new Error('You need to provide VITE_APP_PROJECT_ID env variable');
}
const projectId = import.meta.env.VITE_APP_PROJECT_ID;

// 2. Configure wagmi client
const chains = [goerli, polygon];

const { provider } = configureChains(chains, [
  w3mProvider({ projectId }) as any,
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
        element: <Governance />,
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
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  // If you need a route without the layout, add another object here
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RouterProvider router={router} />
    </WagmiConfig>

    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode={'dark'}
    />
  </React.StrictMode>
);
