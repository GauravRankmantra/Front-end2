import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'; 
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;