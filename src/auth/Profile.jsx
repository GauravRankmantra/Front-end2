import React, { useState, useEffect } from "react";
import { checkAuth } from "../features/authSlice.js";
import { FaFacebook, FaUser } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/userSlice.js";
import { logout } from "../features/authSlice.js";
import { clearQueue } from "../features/musicSlice.js";
import axios from "axios";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../features/userSlice.js";

const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passModel, setPassModel] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingInfoSocial, setIsEditingInfoSocial] = useState(false);
  const [editingInfo, setEditingInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [originalInfo, setOriginalInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [isInfoChanged, setIsInfoChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

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

  useEffect(() => {
    if (userInfo) {
      setOriginalInfo({
        fullName: userInfo.fullName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber || "",
        address: userInfo.address || "",
        facebook: userInfo.facebook || "",
        instagram: userInfo.instagram || "",
        twitter: userInfo.twitter || "",
      });
      setEditingInfo({
        fullName: userInfo.fullName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber || "",
        address: userInfo.address || "",
        facebook: userInfo.facebook || "",
        instagram: userInfo.instagram || "",
        twitter: userInfo.twitter || "",
      });
    }
  }, [userInfo]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post(
        `${apiUrl}api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("musicPlayerData");
      dispatch(clearQueue());
      dispatch(logout());
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };
  const handleSubmitPasswordChange = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Enter Passwords ");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Old password & New password ");
      return;
    }
    s;

    handlePasswordChange(newPassword, oldPassword);
  };

  const handlePasswordChange = async (newPassword, oldPassword) => {
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
        setOldPassword("");
        setNewPassword("");
        setPassModel(false);
        return res;
      } else {
        toast.error("Failed to change password. Please try again.");
        return res;
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Server error occurred.");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      return null;
    }
  };

  const handleInfoChange = (event) => {
    const { name, value } = event.target;
    setEditingInfo((prev) => ({ ...prev, [name]: value }));
    setIsInfoChanged(
      originalInfo.fullName !== editingInfo.fullName ||
        originalInfo.email !== editingInfo.email ||
        originalInfo.phoneNumber !== editingInfo.phoneNumber ||
        originalInfo.address !== editingInfo.address ||
        originalInfo.instagram !== editingInfo.instagram ||
        originalInfo.facebook !== editingInfo.facebook ||
        originalInfo.twitter !== editingInfo.twitter
    );
  };

  const handleEditInfo = () => {
    setIsEditingInfo(true);
  };
  const handleEditInfoSocial = () => {
    setIsEditingInfoSocial(true);
  };

  const handleSaveInfo = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.put(
        `${apiUrl}api/v1/user/update/${userInfo._id}`,
        editingInfo,
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(setUser(res.data.data));
        toast.success("Profile information updated successfully!");
        // dispatch(logoutUser(res.data.data));
        setIsEditingInfo(false);
        setIsInfoChanged(false);
        setOriginalInfo(editingInfo);
      } else {
        toast.error("Failed to update profile information.");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
    setEditingInfo(originalInfo);
    setIsInfoChanged(false);
  };

  const handleCancelEditSocial = () => {
    setIsEditingInfoSocial(false);
    setEditingInfo(originalInfo);
    setIsInfoChanged(false);
  };

  if (!userInfo) {
    return <p className="text-5xl text-center">Loading...</p>;
  }

  return (
    <>
      <div className="min-h-screen font-josefin-r">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-4 px-8 rounded-lg shadow-md mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FaUser />
              <h1 className="text-2xl font-semibold tracking-tight">
                My Profile
              </h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-white text-cyan-500 font-semibold py-2 px-4 rounded-full hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            >
              Explore Music
            </button>
          </div>

          {/* User Information Section */}
          <div className="bg-[#1c223b] p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-cyan-400">
                {t("Your Information")}
              </h2>
              {!isEditingInfo ? (
                <button
                  onClick={handleEditInfo}
                  className="text-gray-400 hover:text-cyan-400 p-1 rounded-full border border-transparent hover:bg-gray-700"
                  title="Edit Information"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveInfo}
                    disabled={!isInfoChanged}
                    className={`text-gray-400 hover:text-green-400 p-1 rounded-full border border-transparent hover:bg-gray-700 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Save Changes"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaSave className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-red-400 p-1 rounded-full border border-transparent hover:bg-gray-700"
                    title="Cancel Edit"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {isEditingInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-cyan-400 block mb-1"
                  >
                    {t("yourName")} *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editingInfo.fullName}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-cyan-400 block mb-1">
                    {t("yourEmail")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editingInfo.email}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="text-cyan-400 block mb-1"
                  >
                    {t("phoneNumber")}
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editingInfo.phoneNumber}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="text-cyan-400 block mb-1">
                    {t("address")}
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editingInfo.address}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-x-3">
                  <span className="font-semibold text-white">
                    {t("yourName")}:{" "}
                  </span>
                  <span className="text-gray-300">{userInfo.fullName}</span>
                </div>
                <div className="space-x-3">
                  <span className="font-semibold text-white">
                    {t("yourEmail")}:{" "}
                  </span>
                  <span className="text-gray-300">{userInfo.email}</span>
                </div>
                {userInfo.phoneNumber && (
                  <div className="space-x-3">
                    <span className="font-semibold text-white">
                      {t("phoneNumber")}:{" "}
                    </span>
                    <span className="text-gray-300">
                      {userInfo.phoneNumber}
                    </span>
                  </div>
                )}
                {userInfo.address && (
                  <div className="space-x-3">
                    <span className="font-semibold text-white">
                      {t("address")}:{" "}
                    </span>
                    <span className="text-gray-300">{userInfo.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-[#1c223b] p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-cyan-400">
                {userInfo.instagram || userInfo.facebook || userInfo.twitter
                  ? `   Your Socal Links`
                  : `Add you social links`}
              </h2>
              {!isEditingInfoSocial ? (
                <button
                  onClick={handleEditInfoSocial}
                  className="text-gray-400 hover:text-cyan-400 p-1 rounded-full border border-transparent hover:bg-gray-700"
                  title="Edit Information"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveInfo}
                    disabled={!isInfoChanged}
                    className={`text-gray-400 hover:text-green-400 p-1 rounded-full border border-transparent hover:bg-gray-700 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Save Changes"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaSave className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCancelEditSocial}
                    className="text-gray-400 hover:text-red-400 p-1 rounded-full border border-transparent hover:bg-gray-700"
                    title="Cancel Edit"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {isEditingInfoSocial ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="Facebook"
                    className="text-cyan-400 block mb-1"
                  >
                    {t("Facebook Link")} *
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={editingInfo.facebook}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="instagram"
                    className="text-cyan-400 block mb-1"
                  >
                    {t("Instagram Link")} *
                  </label>
                  <input
                    type="instagram"
                    id="instagram"
                    name="instagram"
                    value={editingInfo.instagram}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="twitter" className="text-cyan-400 block mb-1">
                    {t("Twitter Link")}
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={editingInfo.twitter}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <div>
                  <a href={userInfo.facebook} target="_blank">
                    <FaFacebook className="text-white text-4xl" />
                  </a>
                </div>
                <div>
                  <a href={userInfo.instagram} target="_blank">
                    <RiInstagramFill className="text-white text-4xl" />
                  </a>
                </div>
                <div>
                  <a href={userInfo.twitter} target="_blank">
                    <FaSquareXTwitter className="text-white text-4xl" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-[#1c223b] p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              {t("changePassword")}
            </h2>
            <button
              onClick={() => setPassModel(true)}
              className="bg-cyan-500 text-white py-2 px-6 rounded-3xl hover:bg-cyan-600 transition duration-200"
            >
              {t("changePassword")}
            </button>
          </div>
          {/* Change Password Section */}
          <div className=" flex items-center px-6 space-x-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              {t("Account")}
            </h2>
            <h1 className="font-semibold text-sm text-cyan-100 mb-4">
              <span className="text-lg">Member Since : </span>
              {userInfo?.createdAt &&
                new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </h1>
          </div>
          {/* Static Information Sections */}
          {/* <div className="grid grid-cols-1 gap-8">
            <div className="bg-[#1c223b] space-y-2 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                {t("Membership And Billing")}
              </h2>
              <p className="text-gray-300">
                {t("Membership Status")}:{" "}
                <span className="text-yellow-500">Premium</span>
              </p>
              <p className="text-gray-300">
                {t("Billing Cycle")}:{" "}
                <span className="text-white">Monthly</span>
              </p>
              <p className="text-gray-300">
                {t("Next Billing Date")}:{" "}
                <span className="text-white">2024-08-15</span>
              </p>
            </div>
            <div className="bg-[#1c223b] space-y-2 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                {t("Package Details")}
              </h2>
              <p className="text-gray-300">
                {t("Package Name")}:{" "}
                <span className=" text-yellow-500">Premium</span>
              </p>
              <p className="text-gray-300">
                {t("Features")}:
                <ul className="list-disc list-inside text-white">
                  <li>{t("Unlimited Lisitening")}</li>
                  <li>{t("50 Downloads")}</li>
                  <li>{t("100 Uplodes")}</li>
                </ul>
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Change Password Modal */}
      {passModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg sm:max-w-[425px] w-full">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-cyan-400">
                {t("changePassword")}
              </h2>
              <p className="text-gray-300">{t("enterCurrentAndNewPassword")}</p>
            </div>
            <form
              className="space-y-4 p-4"
              onSubmit={handleSubmitPasswordChange}
            >
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-cyan-400 mb-1"
                >
                  {t("currentPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    placeholder={t("enterCurrentPassword")}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 bg-gray-700 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <FaEye className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-cyan-400 mb-1"
                >
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder={t("enterNewPassword")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-3 bg-gray-700 text-white"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEye className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-md shadow-sm text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t("submit")}
                </button>
              </div>
            </form>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setPassModel(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 float-right"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
