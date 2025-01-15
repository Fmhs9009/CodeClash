import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  const location = useLocation(); // Get the current route location

  // Routes where NavBar should be hidden
  const excludedPaths = ['/', '/mode/contest-mode/contest-page'];

  // Check if current route matches any excluded path
  const hideNavBar = excludedPaths.some((path) => location.pathname==path);

  return (
    <div>
      {!hideNavBar && <NavBar />} {/* Show NavBar only if not on excluded paths */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
