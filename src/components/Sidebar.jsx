import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const isProfileRoute = location.pathname === "/profile";

  const toggleSidebar = useCallback(() => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
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
      className={` fixed pt-5 font-josefin-m z-50 bg-[#1e233f] top-[60px] ${
        openMenu ? "w-[200px]" : "w-[80px]"
      } transition-all duration-300 shadow-lg hidden lg:block`}
    >
      <div
        onClick={toggleSidebar}
        className={`${
          isProfileRoute && "hidden"
        } absolute right-[-24px] top-1/2 transform -translate-y-1/2 cursor-pointer w-[55px] h-[55px] bg-[#1b2039] rounded-full flex items-center justify-center`}
      >
        <FaAngleRight className="text-[#cdcdcd] text-[20px] ml-6 transition-transform duration-500 hover:rotate-180" />
      </div>

      <div
        className={`${
          openMenu ? "w-[200px]" : "w-[80px]"
        } h-screen  bg-[#1b2039]  flex flex-col object-cover items-center transition-all duration-300`}
      >
        {/* <div className="flex  justify-center  items-center ">
          <Link to="/" onClick={scrollToTop} className="w-full text-center">
            <img
              src={logo}
              alt="logo"
              className="p-4 w-20 h-20 object-cover rounded-full"
            />
          </Link>
        </div> */}

        <div
          className="mt-5 w-full mb-12 sm:mb-6 lg:mb-28 xl:mb-24 overflow-y-auto max-h-screen no-scrollbar"
        >
          <ul className={`${isAuthenticated ? "space-y-3" : "space-y-14 mt-10"} `}>
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  onClick={scrollToTop}
                  className={({ isActive }) =>
                    `flex items-center justify-center text-[#cdcdcd] text-sm py-2 px-4 w-full hover:bg-[#2cc8e5] hover:text-white relative group ${
                      isActive ? "bg-[#2cc8e5] text-white" : ""
                    }`
                  }
                >
                  <div className="flex flex-col group h-[25px] overflow-hidden items-center  justify-center">
                    <img
                      src={item.icon}
                      alt={item.text}
                      className="w-[25px] translate-y-3 group-hover:-translate-y-11  h-[25px]  mr-2 transition-all duration-300"
                    />
                    <img
                      src={item.icon}
                      alt={item.text}
                      className="w-[25px] translate-y-3 group-hover:-translate-y-3  h-[25px]  mr-2 transition-all duration-300"
                    />
                  </div>

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
                    onClick={scrollToTop}
                    className={({ isActive }) =>
                      `flex items-center justify-center text-[#cdcdcd] text-sm py-2 px-4 w-full hover:bg-[#2cc8e5] hover:text-white relative group ${
                        isActive ? "bg-[#2cc8e5] text-white" : ""
                      }`
                    }
                  >
                    <div className="flex flex-col group h-[25px] overflow-hidden items-center  justify-center">
                      <img
                        src={item.icon}
                        alt={item.text}
                        className="w-[25px] translate-y-3 group-hover:-translate-y-11  h-[25px]  mr-2 transition-all duration-300"
                      />
                      <img
                        src={item.icon}
                        alt={item.text}
                        className="w-[25px] translate-y-3 group-hover:-translate-y-3  h-[25px]  mr-2 transition-all duration-300"
                      />
                    </div>
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
                    onClick={scrollToTop}
                    className={({ isActive }) =>
                      `flex items-center justify-center text-[#cdcdcd] text-sm py-2 px-4 w-full hover:bg-[#2cc8e5] hover:text-white relative group ${
                        isActive ? "bg-[#2cc8e5] text-white" : ""
                      }`
                    }
                  >
                    <div className="flex flex-col group h-[25px] overflow-hidden items-center  justify-center">
                      <img
                        src={item.icon}
                        alt={item.text}
                        className="w-[25px] translate-y-3 group-hover:-translate-y-11  h-[25px]  mr-2 transition-all duration-300"
                      />
                      <img
                        src={item.icon}
                        alt={item.text}
                        className="w-[25px] translate-y-3 group-hover:-translate-y-3  h-[25px]  mr-2 transition-all duration-300"
                      />
                    </div>
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
