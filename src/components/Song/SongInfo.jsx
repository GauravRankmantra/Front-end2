import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import { useDispatch } from "react-redux";
import SongCard from "./SongCard"

const apiUrl = import.meta.env.VITE_API_URL;

// --- SKELETON LOADER COMPONENT ---
const SongInfoSkeleton = () => (
  <div className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 animate-pulse">
    <div className="text-center mb-12">
      <div className="h-10 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
    </div>
    <div className="max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-lg overflow-hidden bg-gray-700"></div>
      <div className="flex-1 w-full text-center md:text-left space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded w-5/6"></div>
        <div className="h-6 bg-gray-700 rounded w-2/3"></div>
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const SongInfo = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSongClick = () => {
    if (song) {
      dispatch(addSongToHistory(song));
      dispatch(addSongToQueueWithAuth(song));
      dispatch(setIsPlaying(true));
    }
  };

  const formatDuration = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "N/A";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}api/v1/song/${id}`
        );
        setSong(response.data.data);
      } catch (err) {
        console.error("Failed to fetch song:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch song details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) {
    return <SongInfoSkeleton />; // Use the skeleton loader
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-4">
        <p className="text-red-500 text-3xl font-bold mb-4 text-center">
          Oops! Something went wrong.
        </p>
        <p className="text-gray-300 text-lg text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 px-4">
        <p className="text-white text-3xl font-bold mb-4 text-center">
          Song Not Found
        </p>
        <p className="text-gray-400 text-lg text-center">
          The song you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")} // Redirect to home or another relevant page
          className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg">
          {song.title}
        </h1>
        {song.subtitle && (
          <p className="text-xl text-gray-400 mt-2">{song.subtitle}</p>
        )}
      </div>

      <div className="max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div
          className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            className="w-full h-full object-cover"
            src={
              song.coverImage ||
              "https://via.placeholder.com/600x400?text=No+Cover"
            }
            alt={song.title}
          />
          {isHovered && (
            <div
              onClick={handleSongClick}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 cursor-pointer transition-opacity duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white transform transition-transform duration-300 hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-4 text-center md:text-left">
          <div className="info-item">
            <p className="text-xl font-semibold text-gray-300 mb-1">Artist:</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-2 text-lg">
              {Array.isArray(song.artist) ? (
                song.artist.map((artistObj, index) => (
                  <span
                    key={artistObj._id || `artist-${index}`}
                    onClick={() => navigate(`/artist/${artistObj._id}`)}
                    className="cursor-pointer text-blue-400 hover:underline transition-colors duration-200"
                  >
                    {artistObj.fullName}
                    {index !== song.artist.length - 1 && ","}
                  </span>
                ))
              ) : (
                <span
                  onClick={() =>
                    song.artist?._id && navigate(`/artist/${song.artist._id}`)
                  }
                  className={`text-blue-400 ${
                    song.artist?._id ? "cursor-pointer hover:underline" : ""
                  }`}
                >
                  {song.artist?.fullName || song.artist || "Unknown Artist"}
                </span>
              )}
            </div>
          </div>

          <div className="info-item">
            <p className="text-xl font-semibold text-gray-300 mb-1">Album:</p>
            <p
              onClick={() =>
                song.album?._id && navigate(`/album/${song.album._id}`)
              }
              className={`text-lg ${
                song.album?._id
                  ? "cursor-pointer text-blue-400 hover:underline"
                  : "text-gray-400"
              }`}
            >
              {song.album?.title || "No album"}
            </p>
          </div>

          <div className="info-item">
            <p className="text-xl font-semibold text-gray-300 mb-1">Genre:</p>
            <p
              onClick={() =>
                song.genre?._id && navigate(`/genre/${song.genre.name}`)
              }
              className={`text-lg ${
                song.genre?._id
                  ? "cursor-pointer text-blue-400 hover:underline"
                  : "text-gray-400"
              }`}
            >
              {song.genre?.name || "Unknown"}
            </p>
          </div>

          <div className="info-item">
            <p className="text-xl font-semibold text-gray-300 mb-1">
              Duration:
            </p>
            <p className="text-lg text-gray-400">{song.duration}</p>
          </div>
        </div>
      </div>

      {song.lyrics && (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">
            Lyrics
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
            {song.lyrics}
          </p>
        </div>
      )}

      {song.description && (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">
            Description
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
            {song.description}
          </p>
        </div>
      )}

      <div className="my-4">
        <SongCard
          heading={"More Form Artist"}
          link={`${apiUrl}api/v1/song/top15`}
        />
      </div>
    </div>
  );
};

export default SongInfo;
