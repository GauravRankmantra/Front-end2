import React, { useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import formateDuration from "../utils/formatDuration"
const apiUrl = import.meta.env.VITE_API_URL;

const NewReleases = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}api/v1/song/new-release`
        ); // Replace with your actual API endpoint

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
              New Releases
              <div className="absolute bottom-0  w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
            </h1>
          </div>

          <a href="#" className="md:text-sm text-xs text-cyan-200 hover:underline">
            View More
          </a>
        </div>
        <div className="flex md:justify-center items-center space-x-8 overflow-x-scroll scrollbar-hide  no-scrollbar">
          {songs.map((track,index) => (
            <div
              key={index}
              className="group space-x-4 justify-center content-center items-center flex relative px-5  bg-gray-800 rounded-lg  hover:cursor-pointer transition duration-300 ease-in-out"
            >
              <div className="w-20 h-14 rounded bg-gray-900">
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex justify-center items-center">
                <h3 className="text-sm text-center px-1 font-medium text-white hover:text-cyan-500">
                  {track.title}
                </h3>
                <p className="text-sm text-center text-gray-400  hover:text-cyan-500">
                  {track.artistDetails.fullName}
                </p>
              </div>

              <p className="text-sm text-gray-400  hover:text-cyan-500">
                {formateDuration(track.duration)}
              </p>
              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewReleases;
