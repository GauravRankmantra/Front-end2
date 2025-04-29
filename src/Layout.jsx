import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import MusicPlayer from "./components/MusicPlayer";
import { Toaster } from "react-hot-toast";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
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

      <div className="flex flex-1 scroll-smooth no-scrollbar">
        <Sidebar />
        <div className="flex-auto mx-2 font-josefin-sb sm:mx-10 font- lg:mx-36 mt-12 overflow-hidden  ">
          <Outlet />
        </div>
      </div>
      <MusicPlayer />

      <Footer />
    </div>
  );
};

export default Layout;
