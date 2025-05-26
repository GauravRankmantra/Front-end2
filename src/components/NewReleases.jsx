import React, { useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import formateDuration from "../utils/formatDuration";
import { useDispatch } from "react-redux";
const apiUrl = import.meta.env.VITE_API_URL;
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../features/musicSlice.js";
import { useTranslation } from "react-i18next";

const NewReleases = () => {
  const dispatch = useDispatch();
  const [songs, setSongs] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  const { t } = useTranslation();

  const viewMoreClick = () => {
    setViewMore(!viewMore);
  };

  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
  };
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/v1/song/new-release`); // Replace with your actual API endpoint

        setSongs(response.data.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="bg-gray-900  mx-2 sm:mx-10 lg:mx-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full mb-6">
            <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
              {t("newReleases")}
              <div className="absolute bottom-0  w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
            </h1>
          </div>

          <button
            onClick={viewMoreClick}
            className="md:text-sm text-xs text-cyan-500 hover:underline"
          >
            {viewMore ? "Show Less" : "Show More"}
          </button>
        </div>
        <div
          className={`w-full px-4 ${
            viewMore
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center" // Grid for viewMore=true
              : "flex items-center space-x-4 overflow-x-auto scrollbar-hide no-scrollbar" // Flex scroll for viewMore=false
          }`}
        >
          {songs.map((track, index) => (
            <div
              key={index}
              onClick={() => handleSongClick(track)}
              className="group min-w-[300px]  z-50 flex items-center space-x-4 relative px-5 py-3 bg-gray-800 rounded-lg hover:cursor-pointer transition duration-300 ease-in-out"
            >
              {/* Cover Image */}
              <div className="w-20 h-14 z-40 flex-shrink-0 rounded bg-gray-900 overflow-hidden">
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Song Info */}
              <div className="flex flex-col z-40 justify-center">
                <h3 className="text-sm font-semibold text-white hover:text-cyan-500 truncate">
                  {track.title}
                </h3>
                <p className="text-xs text-gray-400 hover:text-cyan-500 truncate">
                  {track.artistDetails.fullName}
                </p>
              </div>

              {/* Duration */}
              <div className="ml-auto text-sm text-gray-400 hover:text-cyan-500">
                {track.duration}
              </div>

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
               <div className="absolute rounded-lg inset-0 translate-x-[300px] lg:group-hover:translate-x-[5.7rem] z-0 bg-gradient-to-l from-cyan-500 to-transparent flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewReleases;
