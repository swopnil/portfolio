// components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
const Layout = () => {
  const location = useLocation();
  const isMyStoryPage = location.pathname === '/my-story';

  return (
    <div className="min-h-screen">
      <Navbar /> {/* Remove the conditional */}
      <Outlet />
    </div>
  );
};

export default Layout;