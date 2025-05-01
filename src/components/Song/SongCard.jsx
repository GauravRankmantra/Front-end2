import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { setShowLoginPopup } from "../../features/uiSlice";
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
  const showLoginPopup = useSelector((state) => state.ui.showLoginPopup);

  const [loginPopupSong, setLoginPopupSong] = useState(null);

  const closeLoginPopup = () => dispatch(setShowLoginPopup(false));
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
    navigate(`/purchased?id=${encodeURIComponent(song._id)}`);
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
    setLoginPopupSong(song);
    dispatch(setIsPlaying(true));
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
      {showLoginPopup && loginPopupSong && (
        <LoginCard song={loginPopupSong} onClose={closeLoginPopup} />
      )}
      <div className="relative mx-2  sm:mx-10 lg:mx-10">
        <div className="w-full mb-6 flex justify-between items-center">
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
          <div className="relative">
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
                      className="relative flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] group "
                    >
                      <div
                        className="relative overflow-hidden rounded-[10px] aspect-square group"
                        onMouseLeave={() => setCurrentSong(null)} // Hide menu on mouse leave
                      >
                        <img
                          className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
                          src={
                            song.coverImage || "https://dummyimage.com/150x150"
                          }
                          alt={song.title}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <AiFillPlayCircle
                            className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                            onClick={() => handleSongClick(song)}
                          />
                          {song.price > 0 && (
                            <>
                              {user?.purchasedSongs?.includes(song._id) ? (
                                <div className="absolute  flex  justify-center items-center space-x-1 bottom-1 bg-green-600 text-white rounded-xl px-3 py-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-white"
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
                                <div className="absolute   flex justify-center items-center space-x-1 bottom-1 bg-blue-600 text-white rounded-xl px-3 py-1">
                                  <img
                                    src={cart}
                                    className="w-5 h-5 text-white"
                                    alt="Cart"
                                  />
                                  <button
                                    onClick={() => handelBuyNowClick(song)}
                                  >
                                    Buy Now
                                  </button>
                                </div>
                              )}
                            </>
                          )}

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
                      </div>

                      <div className="text-left mt-4">
                        <h1 className="text-[14px] mb-[5px]">
                          <a
                            href="#"
                            className="text-white hover:text-[#3bc8e7]"
                          >
                            {song.title}
                          </a>
                        </h1>
                        <p className="text-[#dedede] text-[12px]">
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
