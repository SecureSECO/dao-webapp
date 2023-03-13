import React from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
};

export default Layout;
