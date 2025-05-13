import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import MusicPlayer from "./components/MusicPlayer";
import { Toaster } from "react-hot-toast";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./components/CookieConsent";
import RightSidebar from "./components/Profile/RightSidebar";
import LeftSidebar from "./components/Profile/LeftSidebar";

const LayoutProfile = () => {
  useEffect(() => {
    
    const hasVisited = localStorage.getItem("hasVisitedToday");
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    if (hasVisited !== today) {
      axios
        .post(`${apiUrl}api/v1/traffic/log`)
        .then(() => {
          localStorage.setItem("hasVisitedToday", today);
        })
        .catch((err) => {
          console.error("Error posting traffic:", err);
        });
    }
  }, []);
  return (
    <div className="flex scroll-smooth flex-col min-h-screen bg-[#14182A] no-scrollbar">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="top-0">
        <Navbar />
      </div>

      <div className="flex flex-row min-h-screen mt-20 scroll-smooth no-scrollbar font-josefin-sb">
        {/* Left Sidebar - Fixed */}
        {/* <div className="w-64 fixed top-20 bottom-0 bg-[#1b2039] text-white shadow-lg z-40 overflow-y-auto no-scrollbar hidden md:block">
        
        </div> */}
        <LeftSidebar />

        {/* Main Outlet Content */}
        <div className="flex-1  md:ml-64 lg:mr-72 mt-0 font-josefin-sb">
          <Outlet />
        </div>

        {/* Right Sidebar - Fixed */}
        <div className="w-72 hidden font-josefin-sb fixed top-20 bottom-0 right-0 bg-[#1b2039] text-white shadow-lg z-40 overflow-y-auto no-scrollbar  lg:block">
          <RightSidebar />
        </div>
      </div>

      <MusicPlayer />
      <CookieConsent />
      <Footer />
    </div>
  );
};

export default LayoutProfile;
