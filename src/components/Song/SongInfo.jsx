import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
} from "../../features/musicSlice";
import { useDispatch } from "react-redux";

const SongInfo = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
    const handleSongClick = () => {
    
      dispatch(addSongToHistory(song));
      dispatch(addSongToQueue(song));
  
      dispatch(setIsPlaying(true));
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
        setError(err.message || "Failed to fetch song.");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-2xl font-semibold">
          Loading song details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-500 text-2xl font-semibold">{error}</p>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-2xl font-semibold">
          No song details available.
        </p>
      </div>
    );
  }

  return (
    <div className=" bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            {song.title}
          </h1>
        </div>
      <div className="max-w-3xl flex justify-center shadow-2xl  items-center border border-gray-700 rounded-xl mx-auto">
        

        <div className="relative rounded-lg  overflow-hidden shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
          <img
            className="w-36  object-cover"
            src={song.coverImage || "https://dummyimage.com/600x400"}
            alt={song.title}
          />
          {isHovered && (
            <div onClick={handleSongClick} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white cursor-pointer"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          <div>
            
          </div>
        </div>

        <div className="  border-l border-gray-600 mx-1">
          <div className=" rounded-lg p-2 shadow-md">
           
            <p className="text-sm whitespace-nowrap">
            <span className="mr-1 text-lg font-semibold mb-1">Artist:</span>
              {Array.isArray(song.artist) ? (
                song.artist.map((artistObj, index) => (
                  <span
                    key={artistObj._id}
                    onClick={() => navigate(`/artist/${artistObj._id}`)} // Example click handler
                    className="cursor-pointer text-sm hover:underline"
                  >
                    {artistObj.fullName}
                    {index !== song.artist.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span className="cursor-pointer text-sm hover:underline">
                  {song.artist?.fullName || song.artist || "Unknown Artist"}
                </span>
              )}
            </p>
          </div>

          <div className=" rounded-lg p-2 shadow-md">
            <p className="text-lg font-semibold mb-1">
              Album:{" "}
              <span className="cursor-pointer text-sm hover:underline">{song?.album?.title || "No album"}</span>
            </p>
          </div>

          <div className="rounded-lg p-2 shadow-md">
            <p className="text-lg font-semibold mb-1">
              Genre:{" "}
              <span className="cursor-pointer text-sm hover:underline">{song.genre.name || "Unknown"}</span>
            </p>
          </div>

          <div className=" rounded-lg p-2 shadow-md">
            <p className=" font-semibold mb-2">
              Duration:{" "}
              <span className="text-sm">
                {Math.floor(song.duration / 60)}:
                {String(Math.floor(song.duration % 60)).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongInfo;
