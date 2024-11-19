// components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const isMyStoryPage = location.pathname === '/my-story';

  return (
    <div className="min-h-screen">
      {/* Only show Navbar on pages other than MyStory */}
      {!isMyStoryPage && <Navbar />}
      <Outlet />
    </div>
  );
};
export default Layout;