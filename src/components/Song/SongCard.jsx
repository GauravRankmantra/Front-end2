import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import cart from "../../assets/svg/artist.svg";
import { useDispatch, useSelector } from "react-redux";
import SongAction from "./SongActions";
import { AiFillPlayCircle } from "react-icons/ai";
import axios from "axios";
import SongShimmer from "../Shimmer/SongShimmer"; // Import the SongShimmer component
const apiUrl = import.meta.env.VITE_API_URL;
import { setShowLoginPopup, setloginPopupSong } from "../../features/uiSlice";
import LoginCard from "../LoginCard";
import { useTranslation } from "react-i18next";

const Recently = ({ heading, link, showGrid }) => {
  const scrollContainerRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(link, { withCredentials: true });

        if (response.data && response.data.data) {
          const sortedSongs = [...response.data.data].sort(
            (a, b) => b.plays - a.plays
          );
          // Sort by plays descending

          setSongs(sortedSongs);
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
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -180, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 180, behavior: "smooth" });
  };

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

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

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  return (
    <>
      <div className="relative sm:mx-10 lg:mx-10">
        <div className="w-full mb-3 flex justify-between items-center">
          <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
            {heading}
            <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
          </h1>
          <h1
            className=" text-[#3bc8e7] cursor-pointer"
            onClick={toggleViewAll}
          >
            {viewAll ? t("hide") : t("viewAll")}
          </h1>
        </div>

        {loading ? (
          <SongShimmer viewAll={viewAll} /> // Show shimmer when loading
        ) : (
          <div className="relative ">
            <div
              ref={scrollContainerRef}
              className={`w-full transition-all duration-400 ${
                viewAll || showGrid
                  ? "grid grid-cols-2 py-4 sm:grid-cols-3 md:grid-cols-4  gap-4 place-items-center"
                  : "flex space-x-6 py-4 overflow-x-scroll scroll-smooth no-scrollbar"
              }`}
              style={{
                willChange: "display, grid-template-columns, gap", // Improve performance
              }}
            >
              {error && <p className="text-white">Error: {error}</p>}

              {!loading && !error && songs?.length > 0
                ? songs.map((song, index) => (
                    <div
                      key={index}
                      className="relative  flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] group "
                    >
                      <div
                        className="relative  overflow-hidden rounded-[10px] aspect-square group"
                        onMouseLeave={() => setCurrentSong(null)} // Hide menu on mouse leave
                      >
                        <div className="absolute inset-0 translate-y-36 group-hover:translate-y-0 z-40 bg-gradient-to-t from-cyan-500 to-transparent flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] transition-all duration-500"></div>
                        <img
                          className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
                          src={
                            song.coverImage || "https://dummyimage.com/150x150"
                          }
                          alt={song.title}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-1000 z-50">
                          <AiFillPlayCircle
                            className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-500 hover:scale-110"
                            onClick={() => handleSongClick(song)}
                          />

                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-2 right-2 w-5 h-5 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                            onClick={() => handleMenuToggle(song)}
                          >
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <circle cx="5" cy="12" r="2" fill="currentColor" />
                            <circle cx="19" cy="12" r="2" fill="currentColor" />
                          </svg>

                          {currentSong && currentSong._id === song._id && (
                            <SongAction
                              onClose={() => setCurrentSong(null)}
                              song={currentSong}
                            />
                          )}
                        </div>
                        {song.price > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-full  px-4 py-1 rounded-full flex items-center justify-center gap-2 text-white text-sm font-medium shadow-lg transition-all z-50">
                            {user?.purchasedSongs?.includes(song._id) ? (
                              <div className="bg-green-600 px-3 py-1 rounded-full flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Purchased</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handelBuyNowClick(song)}
                                className="bg-cyan-500 cursor-pointer shadow-lg hover:bg-cyan-600 px-3 py-1 rounded-full flex items-center gap-2 transition-colors z-50"
                              >
                                <img
                                  src={cart}
                                  className="w-4 h-4"
                                  alt="Cart"
                                />
                                <span className="flex">
                                  Buy
                                  <span className="hidden md:block">_Now</span>
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-left mt-4">
                        <h1 className="text-[14px] mb-[5px] truncate w-[100px]">
                          <button
                            onClick={() => navigate(`/song/${song._id}`)}
                            className="text-white hover:text-[#3bc8e7]"
                          >
                            {song.title}
                          </button>
                        </h1>

                        <p className="text-gray-400 text-[12px]">
                          {Array.isArray(song?.artist)
                            ? song.artist.map((artist, index) => (
                                <span key={index}>
                                  {artist.fullName}
                                  {index !== song.artist.length - 1 && ", "}
                                </span>
                              ))
                            : song?.artist?.fullName ||
                              song?.artist ||
                              "Unknown Artist"}
                        </p>
                      </div>
                    </div>
                  ))
                : !loading &&
                  !error && <p className="text-white">No songs available</p>}
            </div>
          </div>
        )}

        {!viewAll && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full  z-10 transition hidden sm:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 transition-all duration-300 hover:w-7 hover:h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-10 transition hidden sm:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 transition-all duration-300 hover:w-7 hover:h-7 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </>
  );
};
export default Recently;
