/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@/src/components/layout/Layout';
import Dashboard from '@/src/pages/Dashboard';
import ErrorPage from '@/src/pages/ErrorPage';
import Governance from '@/src/pages/Governance';
import Query from '@/src/pages/Query';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import '@/src/index.css';

import { DepositAssets } from '@/src/components/finance/DepositAssets';
import { Toaster } from '@/src/components/ui/Toaster';
import { TooltipProvider } from '@/src/components/ui/Tooltip';
import { DiamondSDKWrapper } from '@/src/context/DiamondGovernanceSDK';
import Finance from '@/src/pages/Finance';
import { Mining } from '@/src/pages/Mining';
import NewProposal from '@/src/pages/NewProposal';
import Settings from '@/src/pages/Settings';
import Swap from '@/src/pages/Swap';
import Verification from '@/src/pages/Verification';
import ViewProposal from '@/src/pages/ViewProposal';

import { AppKitProvider } from './context/AppKitProvider';

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
        children: [
          {
            path: '',
            element: <Finance />,
          },
          {
            path: '/finance/new-deposit',
            element: <DepositAssets />,
          },
        ],
      },
      {
        path: '/verification',
        element: <Verification />,
      },
      {
        path: '/query',
        element: <Query />,
      },
      {
        path: '/mining',
        element: <Mining />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/swap',
        element: <Swap />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster />
    <AppKitProvider>
      <DiamondSDKWrapper>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </DiamondSDKWrapper>
    </AppKitProvider>
  </React.StrictMode>
);
