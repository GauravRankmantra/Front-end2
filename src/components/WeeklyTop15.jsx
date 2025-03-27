import React, { useState, useEffect } from "react";
import { addSongToQueue, setIsPlaying } from "../features/musicSlice";
import { useDispatch } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";
import formatDuration from "../utils/formatDuration";

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
    setCurrentSong(song._id); // Mark the current song as playing
    dispatch(addSongToQueue(song));
    dispatch(setIsPlaying(true));
  };

  return (
    <div className="bg-gray-900 text-gray-300 mx-4 sm:mx-10 lg:mx-10 py-4">
      <div className="container mx-auto">
        <div className="w-full mb-6">
          <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
            {heading}
            <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
          </h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <p className="text-white text-center">Loading songs...</p>
          )}
          {error && <p className="text-white">Error: {error}</p>}

          {!loading && !error && songs.length > 0
            ? songs.map((song, index) => (
                <div
                  key={song._id}
                  onClick={() => handleSongClick(song)}
                  className={`flex relative group items-center justify-between p-4  transition-colors duration-300 cursor-pointer 
                 `}
                >
                  <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r  rounded-s-2xl from-[#8e8e8e] to-transparent"></div>

                  <div className="flex  w-full justify-center items-center">
                    <div
                      className={`text-5xl font-bold transition-all duration-300 ${
                        currentSong === song._id
                          ? "text-cyan-500"
                          : "text-white"
                      } mr-4`}
                    >
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>
                    <div className="relative w-24 h-12">
                      <img
                        src={song.coverImage}
                        alt="Album"
                        className="w-full h-full object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-50"
                      />
                      <AiFillPlayCircle
                        className="absolute inset-0 w-full h-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => handleSongClick(song)}
                      />
                    </div>
                    <div
                      className={`flex items-baseline w-full justify-start mx-2 ${
                        currentSong === song._id
                          ? "text-cyan-500"
                          : "text-white"
                      }`}
                    >
                      <div >
                        <p className="font-bold ">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>

                    </div>
                    <div className="mr-2">
                        <p className="text-xs ">
                          {formatDuration(song.duration)}
                        </p>
                      </div>
                      <div className="text-right">
                    <button className="text-xl text-white">...</button>
                  </div>
                  </div>
                
                </div>
              ))
            : !loading &&
              !error && <p className="text-white">No songs available</p>}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTop15;
