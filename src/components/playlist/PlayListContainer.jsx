import React, { useRef, useState } from "react";
import PlayListCard from "../playlist/PlayListCard";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const PlayListContainer = ({ playlist }) => {
  console.log("playlist in container", playlist);
  const scrollContainerRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null); // Track the current song
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false); // Toggle between "View All" and "Hide"
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -180, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 180, behavior: "smooth" });
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
          Your Playlist's
          <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
        <h1 className=" text-[#3bc8e7] cursor-pointer" onClick={toggleViewAll}>
          {viewAll ? "Hide" : "View All"}
        </h1>
      </div>

      {/* Scrollable Song List or Full Grid */}
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
          {playlist.map((playlist) => (
            <PlayListCard playlist={playlist} key={playlist._id} />
          ))}
        </div>
      </div>

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

export default PlayListContainer;
