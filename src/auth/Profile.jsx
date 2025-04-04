import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/userSlice";
import { clearQueue } from "../features/musicSlice";
import axios from "axios";
import SongCard from "../components/Song/SongCard";
import PlayListContainer from "../components/playlist/PlayListContainer";
const apiUrl = import.meta.env.VITE_API_URL;
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const scrollContainerRef = useRef(null);

  const userInfo = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passModel, setPassModel] = useState(false);
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}api/v1/playlist/userPlaylists`,

          { withCredentials: true }
        );
        if (response?.data && response?.data?.data) {
        
          setPlaylist(response.data.data);
        } else {
          setError("No songs available");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await axios.post(
      `${apiUrl}api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );
    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("musicPlayerData");
      dispatch(clearQueue())
      dispatch(logoutUser());
    }, 1000);

    navigate("/");
  };
  const handleSubmit = (e) => {

    e.preventDefault();
   
    handelChangePass(newPassword, oldPassword);
  };

  const handelChangePass = async (newPassword, oldPassword) => {
    try {
      const res = await axios.post(
        `${apiUrl}api/v1/user/changepass`,
        {
          newPassword,
          oldPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Password changed successfully!");
        setoldPassword("");
        setNewPassword("");
        setPassModel(false);

        return res;
      } else {
        toast.error("Failed to change password. Please try again.", {
          position: "top-right",
        });
        // Handle other successful but unexpected status codes
        return res;
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        toast.error(error.response.data.message || "Server error occurred."); // Show server error message or a generic message.
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("An unexpected error occurred.");
      }

      return null;
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage(reader.result);
  //       setUpdatedInfo((prev) => ({ ...prev, coverImage: reader.result }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const toggleViewAll = () => {
    setViewAll(!viewAll); // Toggle the view state
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  if (!userInfo) {
    return <p className="text-5xl text-center">Loading...</p>;
  }

  return (
    <>
      <div className="bg-[#14182A]  flex flex-col items-center justify-center lg:px-36 md:px-0 mt-10 scroll-smooth no-scrollbar">
        <div className="w-full sm:w-10/12 md:w-6/12 mx-auto py-10 scroll-smooth no-scrollbar">
          <h1 className="text-center text-2xl text-white mt-10 mb-5">
            Edit Profile
          </h1>
          <div className="relative ">
            <div className=" bg-[#1c223b] p-6 sm:p-10 shadow-2xl rounded-xl">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex justify-center mb-6">
                  <label
                    htmlFor="image"
                    className="cursor-pointer relative bg-gray-400 h-36 w-36 rounded-full flex items-center justify-center text-gray-600 text-lg hover:bg-gray-500 transition duration-200"
                    style={{
                      backgroundImage: userInfo?.coverImage
                        ? `url(${userInfo?.coverImage})`
                        : null,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!userInfo?.coverImage && <span>151 x 151</span>}
                    <input
                      type="file"
                      id="image"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      // onChange={handleFileChange}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="text-cyan-400 text-lg" htmlFor="name">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={userInfo.fullName}
                      onChange={handleChange}
                      name="fullName"
                      className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-cyan-400 text-lg" htmlFor="email">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={userInfo.email}
                      onChange={handleChange}
                      name="email"
                      className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                  {/* <button
                    type="submit"
                    className="bg-cyan-500 text-white py-2 px-10 rounded-3xl hover:bg-cyan-600 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-600 text-white py-2 px-10 rounded-3xl hover:bg-gray-700 transition duration-200"
                  >
                    Cancel
                  </button> */}

                  <button
                    onClick={() => setPassModel(true)}
                    className="bg-cyan-500 text-white py-2 px-6 rounded-3xl hover:bg-cyan-600 transition duration-200"
                  >
                    Change password
                  </button>

                  <button
                    type="button"
                    className="bg-red-600 text-white py-2 px-10 rounded-3xl hover:bg-red-700 transition duration-200"
                    onClick={handleLogout}
                  >
                    LogOut
                  </button>
                </div>
              </form>
            </div>
            <div className="w-full h-auto m-auto absolute top-[10%]">
              {passModel && (
                <div className="w-full m-auto p-4">
                  <button
                    onClick={() => setPassModel(false)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 ease-in-out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <form
                    className="flex space-y-4 flex-col w-full max-w-md mx-auto p-6 bg-gray-600 rounded-lg shadow-md"
                    onSubmit={handleSubmit}
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold text-cyan-500">
                        Change Password
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="oldPassword"
                        className="block text-sm font-medium text-cyan-500"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          id="oldPassword"
                          placeholder="Enter current password"
                          value={oldPassword}
                          onChange={(e) => setoldPassword(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? (
                            <FaEye
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-cyan-500"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          placeholder="Enter New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <FaEye
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-md shadow-sm text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2  shadow-2xl bg-[#171c32] rounded-2xl  flex flex-col items-center justify-center lg:px-36 md:px-0 mt-10 scroll-smooth no-scrollbar">
        <div className="w-full m-auto">
          <PlayListContainer playlist={playlist} key={playlist._id} />
        </div>
        <div className="w-full  m-auto mt-5">
          <SongCard
            heading={"Recently played"}
            link={`${apiUrl}api/v1/user/gethistory`}
          />
        </div>
        <div className="w-full m-auto mt-5">
          <SongCard heading={"Liked Songs"} link={`${apiUrl}api/v1/like`} />
        </div>
      </div>
    </>
  );
};

export default Profile;
