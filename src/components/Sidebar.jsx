import React, { useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link for active highlighting
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

  const toggleSidebar = useCallback(() => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
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
    {
      to: "/featured-playlist",
      icon: <FaListAlt />,
      text: "featured playlist",
    },
    { to: "/create-playlist", icon: <FaPlusCircle />, text: "create playlist" },
  ];

  return (
    <div
      className={`fixed top-5 bottom-0 z-50 bg-[#1b2039] ${
        openMenu ? "w-[200px]" : "w-[80px]"
      } transition-all duration-300 shadow-lg hidden lg:block`}
    >
      <div
        onClick={toggleSidebar}
        className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 cursor-pointer w-[55px] h-[55px] bg-[#1b2039] rounded-full text-center flex items-center justify-center"
      >
        <FaAngleRight className="text-[#cdcdcd] text-[20px] ml-6 transition-all duration-500" />
      </div>

      <div
        className={`${
          openMenu ? "w-[200px]" : "w-[80px]"
        } h-full bg-[#1b2039] flex flex-col items-center pt-10 transition-all duration-300`}
      >
        <div className="flex justify-center items-center min-h-[164px]">
          <div
            className={`${openMenu ? "hidden" : "block"} text-center w-full`}
          >
            <NavLink to="/">
              <img src={logo} alt="logo" className="img-fluid" />
            </NavLink>
          </div>
          <div
            className={`${openMenu ? "block" : "hidden"} text-center w-full`}
          >
            <NavLink to="/">
              <img src={logo} alt="logo" className="img-fluid" />
            </NavLink>
          </div>
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
                      "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate",
                  })}
                  <span
                    className={`${
                      openMenu ? "block" : "hidden"
                    } flex-grow nav_text`}
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
                      "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate",
                  })}
                  <span
                    className={`${
                      openMenu ? "block" : "hidden"
                    } flex-grow nav_text`}
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
                      "w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate",
                  })}
                  <span
                    className={`${
                      openMenu ? "block" : "hidden"
                    } flex-grow nav_text`}
                  >
                    {item.text}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
          background-color: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: blue;
          border-radius: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: transparent;
        }

        .icon-rotate {
          transition: transform 0.4s ease;
        }

        .icon-rotate:hover {
          transform: rotate(360deg);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
