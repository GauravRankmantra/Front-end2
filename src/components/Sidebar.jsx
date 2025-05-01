import React, { useState, useCallback, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import artist from "../assets/svg/artist.svg";
import createPlaylist from "../assets/svg/createPlaylist.svg";
import download from "../assets/svg/download.svg";
import fav from "../assets/svg/fav.svg";
import featurePlaylist from "../assets/svg/featurePlaylist.svg";
import genre from "../assets/svg/genre.svg";
import history from "../assets/svg/history.svg";
import home from "../assets/svg/home.svg";
import purchased from "../assets/svg/purchased.svg";
import topTracks from "../assets/svg/topTracks.svg";
import album from "../assets/svg/album.svg";

import { IoDiamondOutline } from "react-icons/io5";
import logo from "../assets/img/logo.jpeg";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
    const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(false);
  const sidebarRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
      icon: home,
      text: t("discover"),
    },
    { to: "/albums", icon: album, text: t("albums") },
    { to: "/artists", icon: artist, text: t("artist") },
    { to: "/genres", icon: genre, text: t("genres") },
    { to: "/top_track", icon: topTracks, text: t("topTracks") },
  ];

  const secondaryNavItems = [
    { to: "/downloads", icon: download, text: t("downloads") },
    { to: "/purchased-tracks", icon: purchased, text: t("purchased") },
    { to: "/favourites", icon: fav, text: t("favorites") },
    { to: "/history", icon: history, text: t("history") },
  ];

  const playlistNavItems = [
    {
      to: "/featured-playlist",
      icon: featurePlaylist,
      text: t("featuredPlaylist"),
    },
    { to: "/create-playlist", icon: createPlaylist, text: t("createPlaylist") },
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
          <ul className={`${isAuthenticated?'space-y-3' :'space-y-10'} `}>
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
                  <img
                    src={item.icon}
                    alt={item.text}
                    className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`${openMenu ? "block" : "hidden"} flex-grow`}
                  >
                    {item.text}
                  </span>
                </NavLink>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#45f3ff] to-transparent opacity-50"></div>
              </li>
            ))}
          </ul>

          {isAuthenticated && (
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
                    <img
                      src={item.icon}
                      alt={item.text}
                      className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform"
                    />
                    <span
                      className={`${openMenu ? "block" : "hidden"} flex-grow`}
                    >
                      {item.text}
                    </span>
                  </NavLink>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-[#45f3ff] to-transparent opacity-50"></div>
                </li>
              ))}
            </ul>
          )}

          {isAuthenticated && (
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
                    <img
                      src={item.icon}
                      alt={item.text}
                      className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-110 transition-transform"
                    />
                    <span
                      className={`${openMenu ? "block" : "hidden"} flex-grow`}
                    >
                      {item.text}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
