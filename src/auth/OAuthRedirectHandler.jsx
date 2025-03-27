import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import axios from "axios";

const OAuthRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch user data with the token
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/auth/profile",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          dispatch(setUser(response.data.user));
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [dispatch, location, navigate]);

  return <p className="mt-16 text-white">Loading...</p>;
};

export default OAuthRedirectHandler;
