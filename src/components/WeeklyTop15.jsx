import React, { useState, useEffect } from "react";
import { addSongToQueue, setIsPlaying } from "../features/musicSlice";
import { useDispatch } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";
import formatDuration from "../utils/formatDuration";
import WeeklyTop15Shimmer from "./WeeklyTop15shimmer";

const WeeklyTop15 = ({ link, heading }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null); // Track the currently playing song
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${link}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data && data.data) {
          setSongs(data.data);
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

  const handleSongClick = (song) => {
    setCurrentSong(song._id);
    dispatch(addSongToQueue(song));
    dispatch(setIsPlaying(true));
  };

  return (
    <div className="bg-gray-900 text-gray-300 px-4 sm:px-10 lg:px-10 py-4">
      <div className="container mx-auto">
        {/* Heading Section */}
        <div className="w-full mb-6">
          <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
            {heading}
            <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
          </h1>
        </div>

        {/* Conditional Rendering: Shimmer or Actual Content */}
        {loading ? (
          <WeeklyTop15Shimmer /> // Show shimmer when loading
        ) : (
          /* Song Grid */
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Error State */}
            {error && <p className="text-white text-center">Error: {error}</p>}

            {/* Song List */}
            {!loading && !error && songs.length > 0
              ? songs.map((song, index) => (
                  <div
                    key={song._id}
                    onClick={() => handleSongClick(song)}
                    className={`relative group flex items-center p-4  rounded-lg transition-colors duration-300 cursor-pointer hover:bg-gray-700`}
                  >
                    {/* Bottom Divider */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#8e8e8e] to-transparent"></div>

                    {/* Song Index */}
                    <div
                      className={`text-6xl md:text-4xl xl:text-6xl font-bold ${
                        currentSong === song._id ? "text-cyan-500" : "text-white"
                      } mr-4`}
                    >
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>

                    {/* Song Cover Image */}
                    <div className="w-14 h-14 xl:w-20 xl:h-20 flex-shrink-0 mr-4 relative">
                      <img
                        src={song.coverImage}
                        alt="Album"
                        className="w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-300 group-hover:opacity-70"
                      />
                      <AiFillPlayCircle
                        className="absolute inset-0 w-full h-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => handleSongClick(song)}
                      />
                    </div>

                    {/* Song Info */}
                    <div className="flex flex-col justify-between flex-grow overflow-hidden">
                      <p className="font-bold text-sm lg:text-base text-ellipsis overflow-hidden whitespace-nowrap">
                        {song.title}
                      </p>
                      <p className="text-xs lg:text-sm   text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap">
                        {song.artist}
                      </p>
                    </div>

                    {/* Song Duration */}
                    <div className="text-xs block sm:text-sm  lg:hidden xl:hidden 2xl:block text-gray-400 ml-4 flex-shrink-0">
                      {formatDuration(song.duration)}
                    </div>

                    {/* Options Button */}
                    <div className="ml-4 flex-shrink-0 block lg:hidden xl:hidden 2xl:block">
                      <button className="text-xl text-white">...</button>
                    </div>
                  </div>
                ))
              : !loading &&
                !error && (
                  <p className="text-white text-center col-span-full">
                    No songs available
                  </p>
                )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTop15;
