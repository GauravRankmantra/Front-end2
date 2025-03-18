import { Cookie } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'; 
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons'; // Correct import from brands
 
import { faTwitter } from '@fortawesome/free-brands-svg-icons'; 
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'; 

import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.jpeg"

const Profile = () => {
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    email: "",
    password: "",
    coverImage: null,
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    const cookies = new Cookies();
    cookies.remove("user", { path: "/" });
    navigate("/");
    window.location.reload();
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

  const updateUserinfo = async (event) => {
    event.preventDefault();

    const changes = {};
    if (updatedInfo.fullName && updatedInfo.fullName !== userInfo.fullName) {
      changes.fullName = updatedInfo.fullName;
    }
    if (updatedInfo.email && updatedInfo.email !== userInfo.email) {
      changes.email = updatedInfo.email;
    }
    if (updatedInfo.password && updatedInfo.password !== "*****") {
      changes.password = updatedInfo.password;
    }
    if (updatedInfo.coverImage) {
      changes.coverImage = updatedInfo.coverImage;
    }

    if (Object.keys(changes).length > 0) {
      try {
        const userId = userInfo._id;
        const response = await fetch(
          `https://backend-music-xg6e.onrender.com/api/v1/user/update/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(changes),
          }
        );
        const result = await response.json();

        if (response.ok) {
          setUserInfo((prev) => ({ ...prev, ...changes }));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...userInfo, ...changes })
          );
          alert("Profile updated successfully!");
        } else {
          alert("Failed to update profile. Please try again.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating profile.");
      }
    } else {
      alert("No changes detected.");
    }
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("user");

    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

      if (parsedUserInfo.coverImage) {
        setImage(parsedUserInfo.coverImage);
      }
    }
  }, []);

  if (!userInfo) {
    return <p className="text-5xl text-center">Loading...</p>;
  }

  return (
    <>
      <div className="bg-[#14182A] w-full h-screen flex items-center justify-center lg:px-36 md:px-0 mt-10 scroll-smooth no-scrollbar">
        <div className="w-full sm:w-10/12 md:w-6/12 mx-auto py-10 scroll-smooth no-scrollbar">
          <h1 className="text-center text-2xl text-white mt-10 mb-5">
            Edit Profile
          </h1>
          <div className="">
            <div className="bg-[#1c223b] p-6 sm:p-10 shadow-2xl rounded-xl">
              <form onSubmit={updateUserinfo}>
                <div className="flex justify-center mb-6">
                  <label
                    htmlFor="image"
                    className="cursor-pointer relative bg-gray-400 h-36 w-36 rounded-full flex items-center justify-center text-gray-600 text-lg hover:bg-gray-500 transition duration-200"
                    style={{
                      backgroundImage: image ? `url(${image})` : null,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!image && <span>151 x 151</span>}
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

      <footer className="bg-gradient-to-b from-gray-900 to-gray-400 text-gray-400 py-12 lg:px-36 px-12">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} className="w-40 h-24" />
            <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
              Music Template
            </h3>
            <p className="text-white leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div>
            <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
              Useful Links
            </h3>
            <ul className="text-gray-100 space-y-4">
              <li className="cursor-pointer hover:text-gray-300">Albums</li>
              <li className="cursor-pointer hover:text-gray-300">Artists</li>
              <li className="cursor-pointer hover:text-gray-300">Top Albums</li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title relative text-cyan-400 text-xl mb-2">
              Subscribe
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter and get the latest updates and offers.
            </p>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-full p-2 mb-4 bg-gray-100 text-gray-300 rounded focus:outline-none"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full p-2 mb-4 bg-gray-100 text-gray-300 rounded focus:outline-none"
            />
            <button className="w-full sm:w-6/12 bg-cyan-500 text-white py-2 rounded-3xl hover:bg-cyan-600 transition duration-200">
              Sign Me Up
            </button>
          </div>

          <div>
            <h3 className="footer-title relative text-cyan-400 text-xl mb-2 space-y-4">
              Contact Us
            </h3>
            <p className="text-gray-300">
              <strong>Call Us:</strong> (+1) 202-555-0176, (+1) 2025-5501
            </p>
            <p className="text-gray-300">
              <strong>Email Us:</strong> info@gmail.com
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Walk In:</strong> 598 Old House Drive, London
            </p>

            <h3 className="text-cyan-400 text-xl mb-2">Follow Us</h3>
            <div className="flex space-x-3">
              <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
                <FontAwesomeIcon icon={faFacebookF} className="text-white" />
              </a>
              <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-white" />
              </a>
              <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
                <FontAwesomeIcon icon={faTwitter} className="text-white" />
              </a>
              <a href="#" className="bg-cyan-500 p-2 w-10 h-10 rounded">
                <FontAwesomeIcon icon={faGooglePlusG} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Profile;
