import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
} from "../../features/musicSlice";
import { useDispatch } from "react-redux";
import SongAction from "./SongActions";
import { AiFillPlayCircle } from "react-icons/ai";
import axios from "axios";
import SongShimmer from "../Shimmer/SongShimmer"; // Import the SongShimmer component
const apiUrl = import.meta.env.VITE_API_URL;

const Recently = ({ heading, link }) => {
  const scrollContainerRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const likedSongsArray = [];
  const [likedSongs, setLikedSongs] = useState(new Set(likedSongsArray || []));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(link, { withCredentials: true });
        if (response.data && response.data.data) {
          setSongs(response.data.data);
        } else {
          setError("No songs available");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, [link]);


  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -180, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 180, behavior: "smooth" });
  };

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueue(song));

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
    setViewAll(!viewAll); // Toggle the view state
  };

  return (
    <div className="relative mx-4 sm:mx-10 lg:mx-10">
      <div className="w-full mb-6 flex justify-between items-center">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          {heading}
          <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
        <h1 className=" text-[#3bc8e7] cursor-pointer" onClick={toggleViewAll}>
          {viewAll ? "Hide" : "View All"}
        </h1>
      </div>

    
      {loading ? (
        <SongShimmer viewAll={viewAll} /> // Show shimmer when loading
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className={`w-full transition-all duration-400 ${
              viewAll
                ? "grid grid-cols-2 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 place-items-center"
                : "flex space-x-6 py-4 overflow-x-scroll scroll-smooth no-scrollbar"
            }`}
            style={{
              willChange: "display, grid-template-columns, gap", // Improve performance
            }}
          >
            {error && <p className="text-white">Error: {error}</p>}

            {!loading && !error && songs.length > 0
              ? songs.map((song) => (
                  <div
                    key={song._id}
                    className="relative flex-shrink-0 w-[120px] sm:w-[150px] md:w-[190px] group cursor-pointer"
                  >
                    <div
                      className="relative overflow-hidden rounded-[10px] aspect-square group"
                      onMouseLeave={() => setCurrentSong(null)} // Hide menu on mouse leave
                    >
                      <img
                        className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
                        src={song.coverImage || "https://dummyimage.com/150x150"}
                        alt={song.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <AiFillPlayCircle
                          className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
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
                    </div>

                    <div className="text-left mt-4">
                      <h3 className="text-[14px] mb-[5px]">
                        <a href="#" className="text-white hover:text-[#3bc8e7]">
                          {song.title}
                        </a>
                      </h3>
                      <p className="text-[#dedede] text-[12px]">
                        {" "}
                        {song?.artist?.fullName ||
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
  );
};

export default Recently;
