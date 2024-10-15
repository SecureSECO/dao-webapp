import { ReactNode } from 'react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { polygon } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, WagmiProvider } from 'wagmi';

// 1. Get projectID at https://cloud.walletconnect.com
if (!import.meta.env.VITE_APP_PROJECT_ID) {
  throw new Error('You need to provide VITE_APP_PROJECT_ID env variable');
}
const projectId = import.meta.env.VITE_APP_PROJECT_ID;
const queryClient = new QueryClient();

// 2. Configure wagmi client
const chains = [polygon] as const;

const appName = 'SecureSECO DAO' as const;
const appDescription =
  'Decentralized Autonomous Organization for the SecureSECO project.' as const;
const appIcon = 'https://dao.secureseco.org/favicon.svg' as const;
const appUrl = 'https://dao.secureseco.org' as const;
const metadata = {
  name: appName,
  description: appDescription,
  url: appUrl,
  icons: [appIcon],
};

const wagmiAdapter = new WagmiAdapter({
  networks: [...chains],
  projectId,
  transports: {
    [polygon.id]: http('https://polygon-rpc.com'),
  },
  ssr: true,
});

const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [...chains],
  projectId,
  metadata,
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
