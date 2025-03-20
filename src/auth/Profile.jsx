import { Cookie } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons"; // Correct import from brands

import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.jpeg";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/userSlice";

const Profile = () => {
  const [image, setImage] = useState(null);

  const userInfo = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    coverImage: null,
  });

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem("user");
      dispatch(logoutUser());
    }, 1000);

    navigate("/");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setUpdatedInfo((prev) => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  // const updateUserinfo = async (event) => {
  //   event.preventDefault();

  //   const changes = {};
  //   if (updatedInfo.fullName && updatedInfo.fullName !== userInfo.fullName) {
  //     changes.fullName = updatedInfo.fullName;
  //   }
  //   if (updatedInfo.email && updatedInfo.email !== userInfo.email) {
  //     changes.email = updatedInfo.email;
  //   }
  //   if (updatedInfo.password && updatedInfo.password !== "*****") {
  //     changes.password = updatedInfo.password;
  //   }
  //   if (updatedInfo.coverImage) {
  //     changes.coverImage = updatedInfo.coverImage;
  //   }

  //   if (Object.keys(changes).length > 0) {
  //     try {
  //       const userId = userInfo._id;
  //       const response = await fetch(
  //         `https://backend-music-xg6e.onrender.com/api/v1/user/update/${userId}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(changes),
  //         }
  //       );
  //       const result = await response.json();

  //       if (response.ok) {
  //         setUserInfo((prev) => ({ ...prev, ...changes }));
  //         localStorage.setItem(
  //           "user",
  //           JSON.stringify({ ...userInfo, ...changes })
  //         );
  //         alert("Profile updated successfully!");
  //       } else {
  //         alert("Failed to update profile. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error updating profile:", error);
  //       alert("An error occurred while updating profile.");
  //     }
  //   } else {
  //     alert("No changes detected.");
  //   }
  // };

  if (!userInfo) {
    return <p className="text-5xl text-center">Loading...</p>;
  }

  return (
    <>
      <div className="bg-[#14182A] w-full h-full flex items-center justify-center lg:px-36 md:px-0 mt-10 scroll-smooth no-scrollbar">
        <div className="w-full sm:w-10/12 md:w-6/12 mx-auto py-10 scroll-smooth no-scrollbar">
          <h1 className="text-center text-2xl text-white mt-10 mb-5">
            Edit Profile
          </h1>
          <div className="">
            <div className="bg-[#1c223b] p-6 sm:p-10 shadow-2xl rounded-xl">
              <form>
                <div className="flex justify-center mb-6">
                  <label
                    htmlFor="image"
                    className="cursor-pointer relative bg-gray-400 h-36 w-36 rounded-full flex items-center justify-center text-gray-600 text-lg hover:bg-gray-500 transition duration-200"
                    style={{
                      backgroundImage: userInfo.coverImage
                        ? `url(${userInfo.coverImage})`
                        : null,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!userInfo.coverImage && <span>151 x 151</span>}
                    <input
                      type="file"
                      id="image"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
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

                  <div>
                    <label className="text-cyan-400 text-lg" htmlFor="password">
                      Your Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={userInfo.password}
                      onChange={handleChange}
                      name="password"
                      placeholder="****"
                      className="w-full p-2 mt-1 bg-gray-50 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <button
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
          </div>
        </div>
      </div>


    </>
  );
};

export default Profile;
