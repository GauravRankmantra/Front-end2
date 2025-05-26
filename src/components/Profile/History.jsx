import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaMusic, FaPlay, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import Loading from "../Loading";

import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import { useDispatch } from "react-redux";

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
const History = () => {
  const [topSongs, setTopSongs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topSongsResponse = await axios.get(
          `${apiUrl}api/v1/user/gethistory`,
          { withCredentials: true }
        );
        if (topSongsResponse.data && topSongsResponse.data.data) {
          const allTopSongs = topSongsResponse.data.data;

          const sortedTopSongs = [...allTopSongs].sort(
            (a, b) => b.plays - a.plays
          );
          setTopSongs(sortedTopSongs);
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
          console.error("Error fetching songs:", error);
          toast.error("Failed to fetch songs.");
        }
      }
    };

    fetchData();
  }, [apiUrl, toast]);

  const dispatch = useDispatch();

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
  };

  return (
    <>
      {!topSongs || topSongs.length == 0 ? (
        <div className="md:px-4 px-2  py-6">
          <Loading />
        </div>
      ) : (
        <div className="md:px-4 px-2  py-6 font-josefin-m">
          <h1 className="text-white text-2xl mb-2">Recently Played</h1>
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
                            {song.artist
                              .map((artist) => artist.name)
                              .join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          last played on: {formatDate(song.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center ml-4 space-x-3">
                      {song.audioUrls?.high || song.audioUrls?.low ? (
                        <button
                          onClick={() => handleSongClick(song)}
                          className="p-2 rounded-full text-cyan-600 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="Play"
                        >
                          <FaPlay className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                    {!song?.price || song.price === 0 ? (
                      <button
                        className="p-2  hidden md:flex text-xs md:text-sm border border-green-600 text-green-500 hover:border-0 hover:bg-green-500 hover:text-white rounded-lg   focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Purchase Song"
                      >
                        Free
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(
                            `/purchased?id=${encodeURIComponent(song._id)}`
                          )
                        }
                        className="p-2  hidden md:flex text-xs md:text-sm border border-cyan-600 hover:border-0 hover:bg-cyan-500 hover:text-white rounded-lg  text-cyan-500  focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Purchase Song"
                      >
                        Buy
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default History;
