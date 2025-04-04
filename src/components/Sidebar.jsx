import React, { useState, useCallback, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FaAngleRight,
  FaHome,
  FaMusic,
  FaHeadphones,
  FaUser,
  FaDownload,
  FaShoppingCart,
  FaHeart,
  FaHistory,
  FaListAlt,
  FaPlusCircle,
} from "react-icons/fa";
import { IoDiamondOutline } from "react-icons/io5";
import logo from "../assets/img/logo.jpeg";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = useCallback(() => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { to: "/", icon: <FaHome />, text: "discover" },
    { to: "/albums", icon: <FaMusic />, text: "albums" },
    { to: "/artists", icon: <FaUser />, text: "artists" },
    { to: "/genres", icon: <FaHeadphones />, text: "genres" },
    { to: "/top_track", icon: <IoDiamondOutline />, text: "top_tracks" },
  ];

  const secondaryNavItems = [
    { to: "/downloads", icon: <FaDownload />, text: "downloads" },
    { to: "/purchased", icon: <FaShoppingCart />, text: "purchased" },
    { to: "/favourites", icon: <FaHeart />, text: "favourites" },
    { to: "/history", icon: <FaHistory />, text: "history" },
  ];

  const playlistNavItems = [
    { to: "/featured-playlist", icon: <FaListAlt />, text: "featured playlist" },
    { to: "/create-playlist", icon: <FaPlusCircle />, text: "create playlist" },
  ];

  return (
    <div ref={sidebarRef} className={`fixed top-5 bottom-0 z-50 bg-[#1b2039] ${openMenu ? "w-[200px]" : "w-[80px]"} transition-all duration-300 shadow-lg hidden lg:block`}>
      <div
        onClick={toggleSidebar}
        className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 cursor-pointer w-[55px] h-[55px] bg-[#1b2039] rounded-full flex items-center justify-center"
      >
        <FaAngleRight className="text-[#cdcdcd] text-[20px] ml-6 transition-transform duration-500 hover:rotate-180" />
      </div>

      <div className={`${openMenu ? "w-[200px]" : "w-[80px]"} h-full bg-[#1b2039] flex flex-col items-center pt-10 transition-all duration-300`}>
        <div className="flex justify-center items-center min-h-[164px]">
          <NavLink to="/" className="w-full text-center">
            <img src={logo} alt="logo" className="img-fluid" />
          </NavLink>
        </div>

        <div className="w-full mt-[50px] mb-[70px] overflow-y-auto max-h-screen no-scrollbar">
          <ul className="space-y-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-center text-[#cdcdcd] text-sm py-2 px-4 w-full hover:bg-[#2cc8e5] hover:text-white relative group ${
                      isActive ? "bg-[#2cc8e5] text-white" : ""
                    }`
                  }
                >
                  {React.cloneElement(item.icon, {
                    className: "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform",
                  })}
                  <span className={`${openMenu ? "block" : "hidden"} flex-grow`}>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="mt-10 space-y-3">
            {secondaryNavItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-center text-[#cdcdcd] text-sm py-2 px-4 w-full hover:bg-[#2cc8e5] hover:text-white relative group ${
                      isActive ? "bg-[#2cc8e5] text-white" : ""
                    }`
                  }
                >
                  {React.cloneElement(item.icon, {
                    className: "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform",
                  })}
                  <span className={`${openMenu ? "block" : "hidden"} flex-grow`}>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="mt-10 space-y-3">
            {playlistNavItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-center text-[#cdcdcd] text-sm py-2 px-4 w-full hover:bg-[#2cc8e5] hover:text-white relative group ${
                      isActive ? "bg-[#2cc8e5] text-white" : ""
                    }`
                  }
                >
                  {React.cloneElement(item.icon, {
                    className: "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform",
                  })}
                  <span className={`${openMenu ? "block" : "hidden"} flex-grow`}>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
