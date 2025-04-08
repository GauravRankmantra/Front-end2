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
    {
      to: "/",
      icon: (
        <svg className="text-white w-44 h-44"  fill="currentColor" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
          <path d="M 22.879 8.71 C 22.763 8.866 22.581 8.948 22.397 8.948 C 22.275 8.948 22.151 8.912 22.045 8.836 L 11.504 1.299 L 0.962 8.836 C 0.696 9.026 0.323 8.969 0.128 8.71 C -0.067 8.45 -0.009 8.085 0.257 7.895 L 11.151 0.106 C 11.361 -0.045 11.646 -0.045 11.856 0.106 L 22.75 7.895 C 23.017 8.085 23.074 8.45 22.879 8.71 Z M 3.144 8.968 C 3.473 8.968 3.741 9.229 3.741 9.551 L 3.741 18.833 L 8.518 18.833 L 8.518 13.766 C 8.518 12.158 9.857 10.85 11.504 10.85 C 13.15 10.85 14.49 12.158 14.49 13.766 L 14.49 18.833 L 19.267 18.833 L 19.267 9.551 C 19.267 9.229 19.534 8.968 19.864 8.968 C 20.194 8.968 20.461 9.229 20.461 9.551 L 20.461 19.416 C 20.461 19.738 20.194 19.999 19.864 19.999 L 13.893 19.999 C 13.578 19.999 13.321 19.762 13.298 19.461 C 13.296 19.448 13.295 19.433 13.295 19.416 L 13.295 13.766 C 13.295 12.801 12.492 12.017 11.504 12.017 C 10.516 12.017 9.712 12.801 9.712 13.766 L 9.712 19.416 C 9.712 19.433 9.711 19.448 9.71 19.461 C 9.686 19.762 9.429 19.999 9.115 19.999 L 3.144 19.999 C 2.814 19.999 2.546 19.738 2.546 19.416 L 2.546 9.551 C 2.546 9.229 2.814 8.968 3.144 8.968 Z" />
        </svg>
      ),
      text: "discover",
    },
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
    {
      to: "/featured-playlist",
      icon: <FaListAlt />,
      text: "featured playlist",
    },
    { to: "/create-playlist", icon: <FaPlusCircle />, text: "create playlist" },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-5 bottom-0 z-50 bg-[#1b2039] ${
        openMenu ? "w-[200px]" : "w-[80px]"
      } transition-all duration-300 shadow-lg hidden lg:block`}
    >
      <div
        onClick={toggleSidebar}
        className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 cursor-pointer w-[55px] h-[55px] bg-[#1b2039] rounded-full flex items-center justify-center"
      >
        <FaAngleRight className="text-[#cdcdcd] text-[20px] ml-6 transition-transform duration-500 hover:rotate-180" />
      </div>

      <div
        className={`${
          openMenu ? "w-[200px]" : "w-[80px]"
        } h-full bg-[#1b2039] flex flex-col items-center pt-10 transition-all duration-300`}
      >
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
                    className:
                      "w-[35px] h-[35px] inline-block mr-2 group-hover:scale-110 transition-transform",
                  })}
                  <span
                    className={`${openMenu ? "block" : "hidden"} flex-grow`}
                  >
                    {item.text}
                  </span>
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
                    className:
                      "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform",
                  })}
                  <span
                    className={`${openMenu ? "block" : "hidden"} flex-grow`}
                  >
                    {item.text}
                  </span>
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
                    className:
                      "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform",
                  })}
                  <span
                    className={`${openMenu ? "block" : "hidden"} flex-grow`}
                  >
                    {item.text}
                  </span>
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
