import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import MusicPlayer from "./components/MusicPlayer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#14182A] no-scrollbar">
      <ToastContainer />
      <div className="top-0">
        <Navbar />
      </div>

      <div className="flex flex-1 scroll-smooth no-scrollbar">
        <Sidebar />
        <div className="flex-auto mx-4 sm:mx-10 lg:mx-36 mt-12 overflow-hidden  ">
          <Outlet />
        </div>
      </div>
      <MusicPlayer />

      <Footer />
    </div>
  );
};

export default Layout;
