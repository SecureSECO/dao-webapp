import Navbar from '@/src/components/layout/Navbar';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
