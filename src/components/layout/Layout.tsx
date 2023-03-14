import Navbar from '@/src/components/layout/Navbar';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="flex h-full w-full justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-7xl px-2">
        <div className="flex w-full items-center justify-center">
          <Navbar />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
