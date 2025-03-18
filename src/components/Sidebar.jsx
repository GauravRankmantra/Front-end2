import React, { useState } from "react";
import { FaAngleRight, FaHome, FaMusic, FaHeadphones, FaUser, FaDownload, FaShoppingCart, FaHeart, FaHistory, FaListAlt, FaPlusCircle } from "react-icons/fa";
import { RiBaseStationLine } from "react-icons/ri";

import logo from "../assets/img/logo.jpeg";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleSidebar = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div
  className={`fixed top-0 bottom-0 z-50 bg-[#1b2039] ${
    openMenu ? "w-[200px]" : "w-[80px]"
  } transition-all duration-300 shadow-lg 
    hidden lg:block`}
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
            <a href="/">
              <img
                src={logo}
                alt="logo"
                className="img-fluid"
              />
            </a>
          </div>
          <div
            className={`${openMenu ? "block" : "hidden"} text-center w-full`}
          >
            <a href="/">
              <img
                src={logo}
                alt="logo"
                className="img-fluid"
              />
            </a>
          </div>
        </div>

        <div className="w-full mt-[50px] mb-[70px] overflow-y-auto max-h-screen custom-scrollbar">
          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaHome className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  discover
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaMusic className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  albums
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaUser className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  artists
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaHeadphones className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  genres
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <RiBaseStationLine className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  Stations
                </span>
              </a>
            </li>
          </ul>

          <ul className="mt-10 space-y-2">
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaDownload className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  downloads
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaShoppingCart className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  purchased
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaHeart className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  favourites
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaHistory className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  history
                </span>
              </a>
            </li>
          </ul>

          <ul className="mt-10 space-y-2">
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaListAlt className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  featured playlist
                </span>
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 px-0 w-full hover:bg-[#2cc8e5] hover:text-white relative group"
              >
                <FaPlusCircle className="w-[25px] h-[25px] inline-block mr-2 group-hover:scale-[1.1] transition-all icon-rotate" />
                <span className={`${openMenu ? "block" : "hidden"} nav_text`}>
                  create playlist
                </span>
              </a>
            </li>
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



