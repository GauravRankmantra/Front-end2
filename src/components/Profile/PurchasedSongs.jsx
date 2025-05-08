import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { FaMusic, FaPlay, FaDownload } from "react-icons/fa";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const PurchasedSongs = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [songs, setSongs] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const handleDownload = async (song) => {
    const songId = song._id;
    try {
      const response = await axios.get(
        `${apiUrl}api/v1/song/isPurchased/${songId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.isPurchased) {
        toast.success("Download started");
        const audioResponse = await axios.get(song.audioUrls.high, {
          responseType: "blob",
        });

        const audioBlob = audioResponse.data;
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob);
        downloadLink.href = url;
        downloadLink.download = `${song.title}.mp3`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
      } else {
        toast.error("Download not allowed. Purchase the song first.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data?.message === "Unauthorized: You Need to Login"
      ) {
        toast.error("You need to login for this functionality.");
      } else {
        toast.error("An error occurred while checking purchase status.");
        console.error(error);
      }
    }
  };

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/v1/user/getPurchasedSong`, {
          withCredentials: true,
        });

        if (res.data.message === "No purchased songs found") {
          setErrorMessage(
            "You don't have any purchased songs to download. Please purchase a song first."
          );
        } else {
          setSongs(res.data.purchasedSongs);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data?.message === "Unauthorized: You Need to Login"
        ) {
          setErrorMessage("You need to login for this functionality.");
        } else {
          console.error("Error fetching purchased songs:", error);
          toast.error("Failed to fetch purchased songs.");
        }
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/v1/song/top15`);
        if (response.data && response.data.data) {
          const sortedSongs = [...response.data.data].sort(
            (a, b) => b.plays - a.plays
          );

          setTopSongs(sortedSongs);
        } else {
          setTopSongs([]);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data?.message === "Unauthorized: You Need to Login"
        ) {
          setErrorMessage("You need to login for this functionality.");
        } else {
          console.error("Error fetching purchased songs:", error);
          toast.error("Failed to fetch purchased songs.");
        }
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="mt-10 px-4">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-4 px-8 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaMusic />
          <h1 className="text-2xl font-semibold tracking-tight">
            My Music Library
          </h1>
        </div>
        <button className="bg-white text-cyan-500 font-semibold py-2 px-4 rounded-full hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
          Explore More Tracks
        </button>
      </div>

      {!songs || songs.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-md shadow-md text-gray-100 flex flex-col items-center justify-center">
          <FaMusic className="text-5xl mb-4 text-gray-400" />
          <p className="text-center text-lg">
            You haven't purchased any songs yet.
          </p>
        </div>
      ) : (
        <ul className=" rounded-md shadow-md overflow-hidden">
          <h1 className="text-white text-2xl mb-2">Purchased Songs</h1>
          {songs.map((song) => (
            <li
              key={song._id}
              className="bg-[#1c223b] border-b border-gray-700 py-4 px-6 sm:py-5 sm:px-8 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
            >
              <div className="flex items-center flex-grow min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden shadow-sm">
                  <img
                    src={song.coverImage}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/100?text=No+Cover";
                    }}
                  />
                </div>
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {song.title}
                  </p>
                  {song.artist && song.artist.length > 0 && (
                    <p className="text-sm text-gray-500 truncate">
                      Artist:{" "}
                      {song.artist.map((artist) => artist.name).join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Purchased on: {formatDate(song.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-4 space-x-2">
                {song.audioUrls?.high || song.audioUrls?.low ? (
                  <button
                    onClick={() => handleSongClick(song)}
                    className="p-2 rounded-full text-cyan-600 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Play"
                  >
                    <FaPlay className="h-4 w-4" />
                  </button>
                ) : null}

                <button
                  onClick={() => handleDownload(song)}
                  className="p-2 rounded-full  text-cyan-500  focus:outline-none focus:ring-2 focus:ring-green-500"
                  title="Download"
                >
                  <FaDownload className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-16">
        <h1 className="text-white text-2xl mb-2">Songs You may Like</h1>
        {topSongs && (
          <div>
            <ul className=" rounded-md shadow-md overflow-hidden">
              {topSongs.map((song) => (
                <li
                  key={song._id}
                  className="bg-[#1c223b] border-b border-gray-700 py-4 px-6 sm:py-5 sm:px-8 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center flex-grow min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden shadow-sm">
                      <img
                        src={song.coverImage}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/100?text=No+Cover";
                        }}
                      />
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">
                        {song.title}
                      </p>
                      {song.artist && song.artist.length > 0 && (
                        <p className="text-sm text-gray-500 truncate">
                          Artist:{" "}
                          {song.artist.map((artist) => artist.name).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Published on: {formatDate(song.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center ml-4 space-x-2">
                    {song.audioUrls?.high || song.audioUrls?.low ? (
                      <button
                        onClick={() => handleSongClick(song)}
                        className="p-2 rounded-full text-cyan-600 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Play"
                      >
                        <FaPlay className="h-4 w-4" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleDownload(song)}
                      className="p-2 border border-cyan-600 hover:border-0 hover:bg-cyan-500 hover:text-white rounded-full  text-cyan-500  focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Purchase Song"
                    >
                      Purchase Song
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedSongs;
