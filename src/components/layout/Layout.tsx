import Navbar from '@/src/components/layout/Navbar';
import { Outlet } from 'react-router';
import { useAccount } from 'wagmi';

const Layout = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex h-full w-full justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <div className="w-full max-w-7xl px-2">
        <div className="mb-10 flex w-full items-center justify-center">
          <Navbar />
        </div>

        <main>
          {isConnected ? (
            <Outlet />
          ) : (
            // TODO: show the dao even if not connected?
            <div>Connect your wallet to view the DAO</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
