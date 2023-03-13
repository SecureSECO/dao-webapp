import Navbar from '@/src/components/Navbar';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="h-full w-full">
      <Navbar />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
