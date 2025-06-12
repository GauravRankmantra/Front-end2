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
  const [newPasswordError, setNewPasswordError] = useState(false); // For validation feedback

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingInfoSocial, setIsEditingInfoSocial] = useState(false);
  const [editingInfo, setEditingInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [originalInfo, setOriginalInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
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

    // Reset validation error
    setNewPasswordError(false);

    // Validation checks
    if (!oldPassword || !newPassword) {
      toast.error("Please enter both passwords.");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Old password and new password cannot be the same.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      setNewPasswordError(true);
      return;
    }

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
    
    // Update isInfoChanged to properly compare fields, including when a field is cleared
    setIsInfoChanged(() => {
      const updatedInfo = { ...editingInfo, [name]: value }; // Reflect the latest change
      return (
        (originalInfo.fullName || "") !== (updatedInfo.fullName || "") ||
        (originalInfo.email || "") !== (updatedInfo.email || "") ||
        (originalInfo.phoneNumber || "") !== (updatedInfo.phoneNumber || "") ||
        (originalInfo.address || "") !== (updatedInfo.address || "") ||
        (originalInfo.facebook || "") !== (updatedInfo.facebook || "") ||
        (originalInfo.instagram || "") !== (updatedInfo.instagram || "") ||
        (originalInfo.twitter || "") !== (updatedInfo.twitter || "")
      );
    });
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
        setIsEditingInfo(false);
        setIsEditingInfoSocial(false);
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

  const handleSocialLinkClick = (link, platform) => {
    if (!link || link.trim() === "") {
      toast.error(`No ${platform} link provided for this account.`);
      return;
    }
    window.open(link, "_blank");
  };

  if (!userInfo) {
    return <p className="text-5xl text-center text-white">Loading...</p>;
  }

  return (
    <>
      <div className="min-h-screen">
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
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Your Name")} *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editingInfo.fullName}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Your Email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editingInfo.email}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Phone Number")}
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editingInfo.phoneNumber}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Address")}
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editingInfo.address}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-x-3">
                  <span className="font-semibold text-white text-base">
                    {t("Your Name")}:{" "}
                  </span>
                  <span className="text-gray-300 text-base">
                    {userInfo.fullName}
                  </span>
                </div>
                <div className="space-x-3">
                  <span className="font-semibold text-white text-base">
                    {t("Your Email")}:{" "}
                  </span>
                  <span className="text-gray-300 text-base">
                    {userInfo.email}
                  </span>
                </div>
                {userInfo.phoneNumber && (
                  <div className="space-x-3">
                    <span className="font-semibold text-white text-base">
                      {t("Phone Number")}:{" "}
                    </span>
                    <span className="text-gray-300 text-base">
                      {userInfo.phoneNumber}
                    </span>
                  </div>
                )}
                {userInfo.address && (
                  <div className="space-x-3">
                    <span className="font-semibold text-white text-base">
                      {t("Address")}:{" "}
                    </span>
                    <span className="text-gray-300 text-base">
                      {userInfo.address}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-[#1c223b] p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-cyan-400">
                {t("Your Social Links")}
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
                    htmlFor="facebook"
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Facebook Link")}
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={editingInfo.facebook}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>
                <div>
                  <label
                    htmlFor="instagram"
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Instagram Link")}
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={editingInfo.instagram}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div>
                  <label
                    htmlFor="twitter"
                    className="text-cyan-400 block mb-1 text-base"
                  >
                    {t("Twitter Link")}
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={editingInfo.twitter}
                    onChange={handleInfoChange}
                    className="w-full p-2 mt-1 bg-gray-700 text-white rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <div>
                  <button
                    onClick={() =>
                      handleSocialLinkClick(userInfo.facebook, "Facebook")
                    }
                    className={
                      userInfo.facebook && userInfo.facebook.trim() !== ""
                        ? "text-white"
                        : "text-gray-500 cursor-not-allowed"
                    }
                  >
                    <FaFacebook className="text-4xl" />
                  </button>
                </div>
                <div>
                  <button
                    onClick={() =>
                      handleSocialLinkClick(userInfo.instagram, "Instagram")
                    }
                    className={
                      userInfo.instagram && userInfo.instagram.trim() !== ""
                        ? "text-white"
                        : "text-gray-500 cursor-not-allowed"
                    }
                  >
                    <RiInstagramFill className="text-4xl" />
                  </button>
                </div>
                <div>
                  <button
                    onClick={() =>
                      handleSocialLinkClick(userInfo.twitter, "Twitter")
                    }
                    className={
                      userInfo.twitter && userInfo.twitter.trim() !== ""
                        ? "text-white"
                        : "text-gray-500 cursor-not-allowed"
                    }
                  >
                    <FaSquareXTwitter className="text-4xl" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="bg-[#1c223b] p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              {t("Change Password")}
            </h2>
            <button
              onClick={() => setPassModel(true)}
              className="bg-cyan-500 text-white py-2 px-6 rounded-3xl hover:bg-cyan-600 transition duration-200"
            >
              {t("Change Password")}
            </button>
          </div>

          {/* Account Section */}
          <div className="flex items-center px-6 space-x-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              {t("Account")}
            </h2>
            <h1 className="font-semibold text-sm text-cyan-100 mb-4">
              <span className="text-lg font-semibold">Member Since: </span>
              <span className="text-lg font-semibold">
                {userInfo?.createdAt &&
                  new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {passModel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out"
          role="dialog"
          aria-labelledby="change-password-title"
          aria-modal="true"
        >
          <div className="bg-gray-800 text-white rounded-lg shadow-lg sm:max-w-[425px] w-full transform transition-all duration-300 ease-in-out scale-100">
            <div className="p-6 border-b border-gray-700">
              <h2
                id="change-password-title"
                className="text-xl font-semibold text-cyan-400"
              >
                {t("Change Password")}
              </h2>
            </div>
            <form className="space-y-6 p-6" onSubmit={handleSubmitPasswordChange}>
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-cyan-400 mb-2"
                >
                  {t("Current Password")}
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    placeholder={t("Enter Current Password")}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="block w-full rounded-lg border-gray-600 bg-gray-700 text-white p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                    required
                    aria-describedby="oldPassword-error"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    aria-label={showOldPassword ? t("Hide Password") : t("Show Password")}
                  >
                    {showOldPassword ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-cyan-400 mb-2"
                >
                  {t("New Password")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder={t("Enter New Password")}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setNewPasswordError(false);
                    }}
                    className={`block w-full rounded-lg border-gray-600 bg-gray-700 text-white p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 ${
                      newPasswordError ? "border-red-500" : ""
                    }`}
                    required
                    aria-describedby="newPassword-error"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? t("Hide Password") : t("Show Password")}
                  >
                    {showNewPassword ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {newPasswordError && (
                  <p id="newPassword-error" className="text-red-500 text-sm mt-2">
                    {t("New Password Min Length")}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setPassModel(false)}
                  className="py-2 px-4 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                >
                  {t("Close")}
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white inline-block"
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
                    t("Submit")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;