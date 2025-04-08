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
import logo from "../assets/img/logo.jpeg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, setSearchQuery } from "../features/searchSlice";
import SearchResultsDisplay from "./SearchResultsDisplay";

import { IoDiamondOutline } from "react-icons/io5";
const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const closeSidebar = () => {
    setSidebarOpen(false);
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

  return (
    <div>
      <div className="fixed bg-[#1b2039] py-5 px-8 right-0 left-0 top-0 z-[1000]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-12 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative flex items-center w-full max-w-full sm:max-w-[300px]">
              <input
                type="text"
                className="form-control py-2 pl-3 pr-12 text-sm text-[#777] bg-white rounded-[5px] border-none w-full sm:w-[180px] lg:w-full"
                placeholder="Search Music Here.."
                value={inputValue}
                onChange={handleInputChange}
              />
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 h-[36px] flex items-center justify-center bg-[#3bc8e7] rounded-r-[5px] px-3 cursor-pointer">
                <FaSearch size={18} color="#fff" />
              </span>
            </div>

            <div className="hidden lg:flex items-center text-white text-md">
              <span className="text-[#3bc8e7] w-full">Trending Songs :</span>
              <span className="ml-4 min-w-full">
                <a href="#">Dream your moments, Until I Met You, Gimme...</a>
              </span>
            </div>
          </div>

          {/* Profile or Register/Login */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="relative text-white capitalize cursor-pointer group">
              <div id="google_translate_element" className="absolute right-20 bottom-0 translate-y-5 w-10 h-10 z-10"></div>
            </div>

            {user ? (
              <Link
                to="/profile"
                className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg"
              >
                Profile
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
            <div className="text-white" onClick={() => navigate("/login")}>
              <FaUserAlt size={20} className="cursor-pointer" title="Login" />
            </div>
            <div className="text-white" onClick={() => navigate("/register")}>
              <FaUserPlus size={24} className="cursor-pointer" title="Signup" />
            </div>
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

      {sidebarOpen && (
        <div
          ref={sidebarRef}
          className={`fixed top-10 bottom-0 z-50 w-[200px] transition-transform duration-300 shadow-xl bg-[#1b2039] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            <ul className="space-y-5 mt-10 w-full">
              {[
                { to: "/", icon: <FaHome />, text: "Discover" },
                { to: "/albums", icon: <FaMusic />, text: "Albums" },
                { to: "/artists", icon: <FaUser />, text: "Artists" },
                { to: "/genres", icon: <FaHeadphones />, text: "Genres" },
                {
                  to: "/top_track",
                  icon: <IoDiamondOutline />,
                  text: "Top Tracks",
                },
              ].map((item, index) => (
                <li key={index} className="w-full">
                  <Link
                    to={item.to}
                    className="flex items-center text-[#cdcdcd] text-sm py-2 px-4 hover:bg-[#2cc8e5] hover:text-white rounded-lg transition-all duration-300"
                    onClick={closeSidebar}
                  >
                    {item.icon} <span className="ml-4">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
