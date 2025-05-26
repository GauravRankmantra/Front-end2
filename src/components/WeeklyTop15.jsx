import React, { useState, useEffect } from "react";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToQueueWithAuth,
  addSongToHistory,
} from "../features/musicSlice";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { MdOutlinePriceCheck } from "react-icons/md";

import defaultImage from "../assets/img/defaultImage.jpg";
import { useDispatch, useSelector } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";

import WeekShimmer from "./WeekShimmer";
import { setShowLoginPopup, setloginPopupSong } from "../features/uiSlice";
import LoginCard from "./LoginCard";
import SongAction from "./Song/SongActions";
import { FaShopify } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WeeklyTop15 = ({ link, heading }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null); // Track the currently playing song
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  const handelBuyNowClick = (song) => {
    if (isAuthenticated) {
      navigate(`/purchased?id=${encodeURIComponent(song._id)}`);
    } else {
      toast.loading("Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
        toast.dismiss();
      }, 700);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${link}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data && data.data) {
          setSongs(data.data);
        } else {
          setError("No songs available");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [link]);

  const handleSongClick = (song) => {
    setCurrentSong(song._id);

    dispatch(addSongToQueueWithAuth(song));
    dispatch(addSongToHistory(song));

    dispatch(setIsPlaying(true));
    if (!isAuthenticated) {
      dispatch(setloginPopupSong(song));
      dispatch(setShowLoginPopup(true));
    }
  };
  const handleMenuToggle = (song) => {
    if (currentSong && currentSong._id === song._id) {
      setCurrentSong(null);
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <>
      <div className="bg-gray-900 text-gray-300 mx-2 sm:px-10 lg:px-10 ">
        <div className="container mx-auto">
          {/* Heading Section */}
          <div className="w-full mb-6">
            <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
              {heading}
              <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
            </h1>
          </div>

          {/* Conditional Rendering: Shimmer or Actual Content */}
          {loading ? (
            <WeekShimmer /> // Show shimmer when loading
          ) : (
            /* Song Grid */
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Error State */}
              {error && (
                <p className="text-white text-center">Error: {error}</p>
              )}

              {/* Song List */}
              {!loading && !error && songs.length > 0
                ? songs.map((song, index) => (
                    <div
                      key={song._id}
                      className="relative group flex items-center justify-between gap-4 px-4 py-3  border-b  border-cyan-500/20 transition duration-200"
                    >
                      {/* Index Number */}
                      <div
                        className={`text-4xl group-hover:text-cyan-500 font-semibold w-8 text-right ${
                          currentSong === song._id
                            ? "text-cyan-500"
                            : "text-gray-300"
                        }`}
                      >
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </div>

                      {/* Song Cover + Info */}
                      <div className="flex items-center gap-4 flex-grow min-w-0">
                        {/* Cover Image */}
                        <div className="relative  w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                          <div className="absolute inset-0 translate-y-36 group-hover:translate-y-0 z-40 bg-gradient-to-t from-cyan-500 to-transparent flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] transition-all duration-500"></div>
                          <img
                            src={song.coverImage || defaultImage}
                            alt={song.title}
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
                          />
                          <AiFillPlayCircle
                            onClick={() => handleSongClick(song)}
                            className="absolute inset-0 w-full z-50 h-full p-4 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-1000"
                          />
                        </div>

                        {/* Song Title & Artist */}
                        <div className="flex flex-col justify-center min-w-0">
                          <p
                            className={`text-sm group-hover:text-cyan-600 font-semibold truncate ${
                              currentSong === song._id
                                ? "text-cyan-500"
                                : "text-white "
                            }`}
                            title={song.title}
                          >
                            {song.title}
                          </p>
                          <p
                            className="text-xs  text-gray-400 truncate"
                            title={
                              Array.isArray(song.artist)
                                ? song.artist.map((a) => a.fullName).join(", ")
                                : song?.artist?.fullName ||
                                  song?.artist ||
                                  "Unknown Artist"
                            }
                          >
                            {Array.isArray(song.artist) ? (
                              song.artist.map((artistObj, index) => (
                                <span
                                  key={artistObj._id || `artist-${index}`} // Use _id for unique key
                                  onClick={() =>
                                    navigate(
                                      `/artist/${
                                        artistObj._id
                                      }?name=${encodeURIComponent(
                                        artistObj.fullName
                                      )}`
                                    )
                                  } // Redirect to artist page
                                  className="cursor-pointer hover:underline text-gray-400" // Added styling for clickable link
                                >
                                  {artistObj.fullName}
                                  {index !== song.artist.length - 1 && ", "}
                                </span>
                              ))
                            ) : (
                              <span
                                onClick={() =>
                                  song?.artist?._id &&
                                  navigate(
                                    `/artist/${
                                      song.artist._id
                                    }?name=${encodeURIComponent(
                                      song.artist.fullName || song.artist
                                    )}`
                                  )
                                }
                                className={`text-blue-400 ${
                                  song.artist?._id
                                    ? "cursor-pointer hover:underline"
                                    : ""
                                }`}
                              >
                                {song?.artist?.fullName ||
                                  song?.artist ||
                                  "Unknown Artist"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="text-xs text-gray-400 hidden sm:block">
                        {song.duration}
                      </div>

                      {/* Action Menu */}
                      <div className="relative justify-center items-center space-y-2 flex  flex-col  shrink-0">
                        <button
                          onClick={() => handleMenuToggle(song)}
                          className="text-gray-400  hover:text-white transition"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                          </svg>
                        </button>

                        {/* Action Menu Dropdown */}
                        {currentSong && currentSong._id === song._id && (
                          <div className="absolute top-full right-0 z-10">
                            <SongAction
                              onClose={() => setCurrentSong(null)}
                              song={currentSong}
                            />
                          </div>
                        )}

                        {song.price > 0 && (
                          <div>
                            {user?.purchasedSongs?.includes(song._id) ? (
                              <button className="text-xs flex items-center  rounded-lg  text-green-600 p-[0.4rem]">
                                <MdOutlinePriceCheck className="w-6 h-6" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handelBuyNowClick(song)}
                                className="text-xs flex items-center  rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white p-[0.4rem]"
                              >
                                <span>Buy Now</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                : !loading &&
                  !error && (
                    <p className="text-white text-center col-span-full">
                      No songs available
                    </p>
                  )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WeeklyTop15;
