import React, { useEffect, useRef, useState } from "react";
import {
  FaSearch,
  FaGlobe,
  FaUserAlt,
  FaUserPlus,
  FaUser,
  FaHome,
  FaMusic,
  FaHeadphones,
  FaAngleRight,
} from "react-icons/fa";
import axios from "axios";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import LanguageSelector from "./LanguageSelector";

import logo from "../assets/img/logo.jpeg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, setSearchQuery } from "../features/searchSlice";
import SearchResultsDisplay from "./SearchResultsDisplay";
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
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { IoDiamondOutline } from "react-icons/io5";
const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [songs, setSongs] = useState([]);
  const [error2, setError2] = useState(null);
  const { t } = useTranslation();
  const [lanOpen, setLanOpen] = useState(false);

  const languages = [
    { code: "en", label: "English", icon: "fi-us" },
    { code: "fr", label: "French", icon: "fi-fr" },
    { code: "es", label: "Spanish", icon: "fi-es" },
    { code: "pt", label: "Portuguese", icon: "fi-pt" },
    { code: "hi", label: "Hindi", icon: "fi-in" },
    { code: "ru", label: "Russian", icon: "fi-de" },
    { code: "de", label: "German", icon: "fi-us" },
    { code: "zh", label: "Chinese", icon: "fi-cn" },
  ];

  const { i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/v1/song/top15`, {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          const sortedSongs = [...response.data.data].sort(
            (a, b) => b.plays - a.plays
          );
          // Sort by plays descending

          setSongs(sortedSongs);
        } else {
          setError2("No songs available");
        }
      } catch (err) {
        setError2(err.message);
      }
    };

    fetchData();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const { query, results, loading, error } = useSelector(
    (state) => state.search
  );

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use Redux dispatch

  // Toggles Sidebar
  const toggleSidebar = () => {
    setOpenMenu(!openMenu);
  };
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
  const closeSidebar = () => {
    setOpenMenu(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (inputValue.length >= 2) {
      dispatch(setSearchQuery(inputValue)); // Update query in store
      dispatch(fetchSearchResults(inputValue)); // Fetch search results
    }
  }, [inputValue, dispatch]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Check if user is authenticated
  const user = useSelector((state) => state.user.user);
  // 🔒 Token validation on mount
  useEffect(() => {
    const validateUser = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}api/v1/auth`, {
          withCredentials: true,
        });
        dispatch(setUser(data.user));
      } catch (error) {
        console.log("User not authenticated");
      }
    };

    validateUser();
  }, [dispatch]);

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
    <div>
      <div className="fixed font-josefin-sb bg-[#1b2039] py-5 px-8 right-0 left-0 top-0 z-[1000]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-12 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative flex items-center w-full max-w-full sm:max-w-[300px]">
              <input
                type="text"
                className="form-control py-2 pl-3 pr-12 text-sm text-[#777] bg-white rounded-[5px] border-none w-full sm:w-[180px] lg:w-full"
                placeholder={t("searchMusicHere")}
                value={inputValue}
                onChange={handleInputChange}
              />
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 h-[36px] flex items-center justify-center bg-[#3bc8e7] rounded-r-[5px] px-3 cursor-pointer">
                <FaSearch size={18} color="#fff" />
              </span>
            </div>

            <div className="hidden overflow-hidden lg:flex justify-between items-center text-white text-md">
              <span className="text-[#3bc8e7]">{t("trendingSongs")}</span>
              <span className="ml-4">
                {songs
                  ?.slice(0, 5)
                  .map((song) => song.title)
                  .join(", ")}
                {songs?.length > 5 && "..."}
              </span>
            </div>
          </div>

          {/* Profile or Register/Login */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setLanOpen(!lanOpen)}
                className="border border-gray-700 p-2 text-white rounded shadow"
              >
                🌐 {t("language")}
              </button>

              {/* <LanguageSelector /> */}
              {lanOpen && (
                <div className="absolute w-max mt-2 bg-white border rounded shadow z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <span class={`fi ${lang.icon} fis`}></span> {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg"
              >
                {t("profile")}
              </Link>
            ) : (
              <div className="hidden lg:flex space-x-4">
                <Link
                  to="/register"
                  className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4 ml-4">
            {user ? (
              <Link
                to="/profile"
                className="ms_btn bg-[#3bc8e7] text-sm text-white text-center py-[6px] px-[15px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg"
              >
                Profile
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-white" onClick={() => navigate("/login")}>
                  <FaUserAlt
                    size={20}
                    className="cursor-pointer"
                    title="Login"
                  />
                </div>
                <div
                  className="text-white"
                  onClick={() => navigate("/register")}
                >
                  <FaUserPlus
                    size={24}
                    className="cursor-pointer"
                    title="Signup"
                  />
                </div>
              </div>
            )}

            <button
              className="flex items-center space-x-4"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-8 w-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {inputValue.length >= 2 && (
        <SearchResultsDisplay results={results} setInputValue={setInputValue} />
      )}

      {openMenu && (
        <div
          ref={sidebarRef}
          className={`fixed top-10 bottom-0 z-50 w-[200px] transition-transform duration-300 shadow-xl bg-[#1b2039] ${
            openMenu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden`}
        >
          {/* Toggle Button */}
          <div
            onClick={toggleSidebar}
            className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 cursor-pointer w-[55px] h-[55px] bg-[#1b2039] rounded-full flex items-center justify-center hover:bg-[#2cc8e5] hover:text-white transition-colors duration-500"
          >
            <FaAngleRight className="text-[#cdcdcd] text-[20px] ml-6 transition-all duration-500" />
          </div>

          {/* Sidebar Content */}
          <div className="w-full px-4 h-full bg-[#1b2039] flex flex-col items-start pt-10">
            {/* Logo */}
            <div className="flex justify-center items-center w-full">
              <Link
                to="/"
                className="text-center w-full"
                onClick={closeSidebar}
              >
                <img
                  src={logo}
                  alt="logo"
                  className="w-[80px] h-auto rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Sidebar Links */}
            <div className="w-full mt-[50px] mb-[70px] overflow-y-auto max-h-screen no-scrollbar">
              <ul
                className={`${isAuthenticated ? "space-y-3" : "space-y-10"} `}
              >
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
                          className={`${
                            openMenu ? "block" : "hidden"
                          } flex-grow`}
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
                          className={`${
                            openMenu ? "block" : "hidden"
                          } flex-grow`}
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
      )}
    </div>
  );
};

export default Navbar;
