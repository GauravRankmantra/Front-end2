import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaMusic,
  FaHistory,
  FaHeart,
  FaDownload,
  FaEnvelope,
  FaTachometerAlt,
  FaSignOutAlt, // Added for Logout
  FaHome, // Added for Home
  FaLeaf,
} from "react-icons/fa";
import { CgOptions } from "react-icons/cg";
import { MdAttachMoney } from "react-icons/md";


import { TbLivePhotoFilled } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/userSlice";
import { logout } from "../../features/authSlice";
import { clearQueue } from "../../features/musicSlice";
import { TbMusicDollar } from "react-icons/tb";

import { MdOutlineLocalOffer } from "react-icons/md";
import { MdLiveTv } from "react-icons/md";
import { MdEvent } from "react-icons/md";

const apiUrl = import.meta.env.VITE_API_URL;

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "My Profile", path: "/profile", icon: <FaUser /> },
  { name: "Sell Your Music", path: "/dashboard/sell-song", icon: <TbMusicDollar /> },
    { name: "Withdrawal Method", path: "/dashboard/withdrawal", icon: <MdAttachMoney /> },
  {
    name: "Purchased Songs",
    path: "/dashboard/purchased-songs",
    icon: <FaMusic />,
  },
  { name: "Messages", path: "/dashboard/messages", icon: <FaEnvelope /> },
  { name: "Event", path: "/dashboard/event", icon: <MdEvent /> },
  { name: "Live", path: "/dashboard/live", icon: <MdLiveTv /> },
  { name: "Offers", path: "/dashboard/offer", icon: <MdOutlineLocalOffer /> },
  { name: "History", path: "/dashboard/history", icon: <FaHistory /> },

  { name: "Liked Songs", path: "/dashboard/liked", icon: <FaHeart /> },
  {
    name: "Downloaded Songs",
    path: "/dashboard/download",
    icon: <FaDownload />,
  },
];

const LeftSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutLoading, setlogoutLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;
  const handleLogout = async () => {
    setlogoutLoading(true);
    await axios.post(
      `${apiUrl}api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );
    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("musicPlayerData");
      dispatch(clearQueue());
      dispatch(logout());
      dispatch(logoutUser());
    }, 500);
    setlogoutLoading(false);
    navigate("/");
  };

  return (
    <>
      {/* Hamburger Button - Mobile */}
      {/* <button
        className="fixed top-20 right-2 z-50 text-white text-2xl md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <CgOptions />}
      </button> */}

      {/* Sidebar */}
      {/* <div
        className={`fixed top-0 bottom-0 mt-20 overflow-scroll no-scrollbar bg-[#141834] text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:block  `}
      > */}
        {/* Profile Info */}
        <div className="flex flex-col items-center p-6 border-b border-gray-700">
          {user?.coverImage ? (
            <img
              src={user?.coverImage}
              className="rounded-full object-cover w-20 h-20"
            ></img>
          ) : (
            <FaUser className="text-6xl border border-gray-500 rounded-full p-1 " />
          )}

          <h2 className="mt-3 font-semibold text-lg text-white">
            {user?.fullName}
          </h2>
          {/* <p className="text-sm text-gray-400">User</p>{" "} */}
          {/* Added user role/type */}
          <div className="mt-4 flex gap-4">
            <Link to="/" className="text-gray-300 hover:text-white">
              <FaHome size={20} className="text-blue-500" />
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-white">
              <FaUser size={18} />
            </Link>
            <Link to="/stemming" className="text-gray-300 hover:text-white">
              <TbLivePhotoFilled size={20} className="text-blue-500" />
            </Link>

            <button className="text-gray-300 hover:text-white">
              {logoutLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FaSignOutAlt
                  onClick={() => handleLogout()}
                  size={20}
                  className="text-red-400"
                />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-4 pb-28">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200
              ${
                isActive(item.path)
                  ? "bg-cyan-500 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base">{item.name}</span>
            </Link>
          ))}
        </nav>
      {/* </div> */}
    </>
  );
};

export default LeftSidebar;
