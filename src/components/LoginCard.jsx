import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPlay, FaHeart, FaPlus, FaMusic } from "react-icons/fa"; // Import more icons
import formatDuration from "../utils/formatDuration.js";


const LoginCard = ({ song, onClose }) => {

  console.log("song at login card",song)
  // const navigate = useNavigate();


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden animate-slideInUp">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-50 py-3 px-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaMusic className="mr-2 text-cyan-500" /> Song Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Song Information */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          <div className="relative rounded-lg overflow-hidden shadow-md w-48 h-48">
            <img
              src={song?.coverImage}
              alt={song?.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">
              {song?.title}
            </h3>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Artist:</span>{" "}
              {Array.isArray(song?.artist)
                ? song.artist.map((artist) => artist.fullName).join(", ")
                : song?.artist?.fullName || song?.artist || "Unknown Artist"}
            </p>
            {song?.album && (
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Album:</span> {song.album}
              </p>
            )}
            {song?.genre && (
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Genre:</span> {song.genre}
              </p>
            )}

            {song?.duration && (
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">
                  Duration: {formatDuration(song.duration)}
                </span>
              </p>
            )}
            <p className="text-gray-600 text-xs">
              Played <span className="font-semibold">{song?.plays || "0"}</span>{" "}
              Times
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              className="bg-cyan-100 text-cyan-500 hover:bg-cyan-200 rounded-full p-2 focus:outline-none transition-colors"
              title="Play"
            >
              <FaPlay className="h-5 w-5" />
            </button>
            <button
              className="bg-red-100 text-red-500 hover:bg-red-200 rounded-full p-2 focus:outline-none transition-colors"
              title="Add to Favorites"
            >
              <FaHeart className="h-5 w-5" />
            </button>
            <button
              className="bg-blue-100 text-blue-500 hover:bg-blue-200 rounded-full p-2 focus:outline-none transition-colors"
              title="Add to Playlist"
            >
              <FaPlus className="h-5 w-5" />
            </button>
          </div>

          {/* Login Button */}
          <button
            // onClick={() => {
            //   navigate("/login");
            //   onClose();
            // }}
            className="w-full bg-cyan-500 text-white py-3 px-6 rounded-full hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
          >
            <FaPlay className="inline mr-2" /> Login to Listen Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
