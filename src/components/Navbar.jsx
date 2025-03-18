import React, { useState } from 'react';
import { FaSearch, FaGlobe, FaUserAlt, FaUserPlus,FaUser,FaHome,FaMusic,FaHeadphones, FaAngleRight } from 'react-icons/fa';
import logo from '../assets/img/logo.jpeg'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Handle search input

  // Toggles Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handles the search function
  const handleSearch = () => {
    if (searchQuery) {
      // Redirect or perform search logic here
      console.log("Searching for: ", searchQuery);
    } else {
      console.log("Search query is empty");
    }
  };

  // Check if user is authenticated
  const user = JSON.parse(localStorage.getItem('user'));

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Handle input change
              />
              <span 
                onClick={handleSearch}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 h-[36px] flex items-center justify-center bg-[#3bc8e7] rounded-r-[5px] px-3 cursor-pointer">
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
            <div className="relative text-white capitalize cursor-pointer pr-6 group">
              <span className="flex items-center">
                Languages
                <FaGlobe size={20} className="ml-2" />
              </span>
            </div>

     
            {user ? (
              <Link to="/profile" className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg">
                Profile
              </Link>
            ) : (
              <div className="hidden lg:flex space-x-4">
                <Link to="/register" className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg">Register</Link>
                <Link to="/login" className="ms_btn bg-[#3bc8e7] text-white text-center py-[8px] px-[20px] rounded-[20px] transition-all duration-400 ease-in-out hover:shadow-lg">Login</Link>
              </div>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4 ml-4">
            <div className="text-white">
              <FaUserAlt size={20} className="cursor-pointer" title="Login" />
            </div>
            <div className="text-white">
              <FaUserPlus size={24} className="cursor-pointer" title="Signup" />
            </div>
            <button className="flex items-center space-x-4" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

 
      {sidebarOpen && (
        <div className={`fixed top-0 bottom-0 z-50 bg-[#1b2039] w-[200px] transition-transform duration-300 shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
          <div
            onClick={toggleSidebar}
            className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 cursor-pointer w-[55px] h-[55px] bg-[#1b2039] rounded-full text-center flex items-center justify-center"
          >
            <FaAngleRight className="text-[#cdcdcd] text-[20px] ml-6 transition-all duration-500" />
          </div>

          <div className="w-full h-full bg-[#1b2039] flex flex-col items-center pt-10">
            <div className="flex justify-center items-center min-h-[164px]">
              <div className="text-center w-full">
                <Link to="/">
                  <img src={logo} alt="logo" className="img-fluid" />
                </Link>
              </div>
            </div>

            {/* Sidebar Links */}
            <div className="w-full mt-[50px] mb-[70px] overflow-y-auto max-h-screen custom-scrollbar">
              <ul className="space-y-2">
                <li><Link to="/" className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 w-full hover:bg-[#2cc8e5] hover:text-white"><FaHome className="w-[25px] h-[25px] mr-2" />Discover</Link></li>
                <li><Link to="/albums" className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 w-full hover:bg-[#2cc8e5] hover:text-white"><FaMusic className="w-[25px] h-[25px] mr-2" />Albums</Link></li>
                <li><Link to="/artists" className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 w-full hover:bg-[#2cc8e5] hover:text-white"><FaUser className="w-[25px] h-[25px] mr-2" />Artists</Link></li>
                <li><Link to="/genres" className="flex justify-center items-center text-[#cdcdcd] text-sm py-2 w-full hover:bg-[#2cc8e5] hover:text-white"><FaHeadphones className="w-[25px] h-[25px] mr-2" />Genres</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
