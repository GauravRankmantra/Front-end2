import React, { useRef, useState, useEffect } from "react";
import PlayListCard from "../playlist/PlayListCard";
import { AiOutlinePlus } from "react-icons/ai"; 

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const PlayListContainer = ({ playlist: initialPlaylist }) => {
  const scrollContainerRef = useRef(null);
  const [playlists, setPlaylists] = useState(initialPlaylist); // Initialize with initialPlaylist
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPlaylists(initialPlaylist);
  }, [initialPlaylist]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}api/v1/playlist/userPlaylists`,
        { withCredentials: true }
      );
      
      setPlaylists(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching playlists:", err); // Log the error
      setError(err);
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -180, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 180, behavior: "smooth" });
  };

  const handleMenuToggle = (song) => {
    setCurrentSong(currentSong?._id === song._id ? null : song);
  };

  const toggleViewAll = () => {
    setViewAll(!viewAll);
  };

  const handlePlaylistDeleted = () => {
    fetchPlaylists(); // Reload playlists
  };

  return (
    <div className="relative mx-2 sm:mx-10 lg:mx-10">
      <div className="w-full mb-6 flex justify-between items-center">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          Your Playlist's
          <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
        <h1 className="text-[#3bc8e7] cursor-pointer" onClick={toggleViewAll}>
          {viewAll ? "Hide" : "View All"}
        </h1>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`w-full transition-all duration-400 ${
            viewAll
              ? "grid grid-cols-2 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 place-items-center"
              : "flex space-x-6 py-4 overflow-x-scroll scroll-smooth no-scrollbar"
          }`}
          style={{
            willChange: "display, grid-template-columns, gap",
          }}
        >
          {playlists.map((playlist) => (
            <PlayListCard
              playlist={playlist}
              key={playlist._id}
              onPlaylistDeleted={handlePlaylistDeleted}
            />
          ))}
<div onClick={()=>navigate("/create-playlist")}  className="relative border  rounded-xl border-gray-700 shadow-2xl flex-shrink-0 w-[120px] sm:w-[150px] md:w-[190px] group cursor-pointer">
      <div className="relative overflow-hidden rounded-[10px] aspect-square group">
        <img
          className="w-full h-full object-cover opacity-45 rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
          src="https://marketplace.canva.com/EAFK2_sprFw/2/0/1600w/canva-pink-lo-fi-aesthetic-music-album-cover-24buT5q9V4Y.jpg"
          alt="Add playlist"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300">
          <AiOutlinePlus
            className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
            
          />
          <span className="text-white mt-2">Add Playlist</span>
        </div>
      </div>

      <div className="text-center mt-4">
        <h1 className="text-[14px] mb-[5px]">
          <p className="text-white hover:text-[#3bc8e7]">
            Add Playlist
          </p>
        </h1>
        <p className="text-[#dedede] text-[12px]">Click to create</p>
      </div>
    </div>
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
