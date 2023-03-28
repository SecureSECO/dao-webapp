import Navbar from '@/src/components/layout/Navbar';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="flex min-h-full w-full justify-center bg-slate-50 pb-20 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <div className="w-full max-w-7xl px-4 xs:px-6 md:px-10">
        <div className="mb-10 flex w-full items-center justify-center">
          <Navbar />
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
