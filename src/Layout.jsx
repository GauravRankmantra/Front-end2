import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#14182A] no-scrollbar">
      <div className="top-0">
        <Navbar />
      </div>

      <div className="flex flex-1 ">
        <Sidebar />
        <div className="flex-auto mx-4 sm:mx-10 lg:mx-36 mt-12  overflow-y-auto scroll-smooth no-scrollbar  ">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
