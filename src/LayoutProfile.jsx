import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

import axios from "axios";
import { Menu } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;

import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "./components/CookieConsent";
import RightSidebar from "./components/Profile/RightSidebar";
import LeftSidebar from "./components/Profile/LeftSidebar";

const LayoutProfile = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false); // mobile toggle
  const [collapseRightSidebar, setCollapseRightSidebar] = useState(false); // desktop toggle
  const [collaps, setCollaps] = useState(false);
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
    <div className="flex h-screen overflow-hidden bg-[#14182A]">
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

      <div
        className={`
          fixed top-20 bottom-0 left-0 z-50 bg-[#1b2039] text-white shadow-lg transition-transform duration-300 ease-in-out
          w-64 overflow-scroll no-scrollbar font-josefin-sb
          ${showLeftSidebar ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        <LeftSidebar />
      </div>

      {showLeftSidebar && (
        <div
          className="fixed inset-0 border  z-40 bg-black/50 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        />
      )}

      <div
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${collapseRightSidebar ? "lg:mr-0" : "lg:mr-72"}
          
          relative z-10
        `}
      >
        <div className="flex top-20 left-2 fixed items-center justify-between  z-30">
          <button
            className="lg:hidden text-white"
            onClick={() => setShowLeftSidebar(true)}
          >
            <Menu size={24} />
          </button>
        </div>
        <button
          onClick={() => setCollapseRightSidebar(!collapseRightSidebar)}
          className="hidden absolute top-28 right-0 lg:inline-flex rounded-full text-sm p-1 bg-[#1b2039] text-white hover:bg-[#11152c]"
        >
          <MdKeyboardDoubleArrowLeft
            className={`${
              collapseRightSidebar ? `` : `rotate-180`
            } transition-all duration-300 w-5 h-5`}
          />
        </button>

        <div className=" mt-16 py-4 bg-[#14182A]  no-scrollbar h-[calc(100%-3rem)] overflow-y-auto ">
          <Outlet />
        </div>
      </div>

      <div
        className={`
          hidden lg:block fixed  no-scrollbar top-20 bottom-0 right-0 bg-[#1b2039] text-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out
          ${collapseRightSidebar ? "w-0 opacity-0 pointer-events-none" : "w-72"}
        `}
      >
        {!collapseRightSidebar && <RightSidebar />}
      </div>
    </div>
  );
};

export default LayoutProfile;
