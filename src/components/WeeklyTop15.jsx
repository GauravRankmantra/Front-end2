import React, { useState, useEffect } from "react";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToQueueWithAuth,
  addSongToHistory,
} from "../features/musicSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiFillPlayCircle } from "react-icons/ai";
import formatDuration from "../utils/formatDuration";
import WeekShimmer from "./WeekShimmer";
import { setShowLoginPopup } from "../features/uiSlice";
import LoginCard from "./LoginCard";
import SongAction from "./Song/SongActions";

const WeeklyTop15 = ({ link, heading }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null); // Track the currently playing song
  const dispatch = useDispatch();
  const showLoginPopup = useSelector((state) => state.ui.showLoginPopup);

  const [loginPopupSong, setLoginPopupSong] = useState(null);

  const closeLoginPopup = () => dispatch(setShowLoginPopup(false));

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

    dispatch(addSongToQueueWithAuth(song));
    dispatch(addSongToHistory(song));
    setLoginPopupSong(song);

    dispatch(setIsPlaying(true));
  };
  const handleMenuToggle = (song) => {
    if (currentSong && currentSong._id === song._id) {
      setCurrentSong(null);
    } else {
      setCurrentSong(song);
    }
  };

  return (
    <>
      {showLoginPopup && loginPopupSong && (
        <LoginCard song={loginPopupSong} onClose={closeLoginPopup} />
      )}
      <div className="bg-gray-900 text-gray-300 mx-2 sm:px-10 lg:px-10 py-4">
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
            <WeekShimmer /> // Show shimmer when loading
          ) : (
            /* Song Grid */
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Error State */}
              {error && (
                <p className="text-white text-center">Error: {error}</p>
              )}

              {/* Song List */}
              {!loading && !error && songs.length > 0
                ? songs.map((song, index) => (
                    <div
                      key={index}
                      // onClick={() => handleSongClick(song)}
                      className={`relative group flex items-center p-4  rounded-lg transition-colors duration-300  hover:bg-gray-700`}
                    >
                      {/* Bottom Divider */}
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#8e8e8e] to-transparent"></div>

                      {/* Song Index */}
                      <div
                        className={`text-6xl md:text-4xl xl:text-6xl font-bold ${
                          currentSong === song._id
                            ? "text-cyan-500"
                            : "text-white"
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
                          className="absolute cursor-pointer inset-0 w-full h-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => handleSongClick(song)}
                        />
                      </div>

                      {/* Song Info */}
                      <div className="flex flex-col justify-between flex-grow overflow-hidden">
                        <p className="font-bold text-sm lg:text-base text-ellipsis overflow-hidden whitespace-nowrap">
                          {song.title}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap">
                          {Array.isArray(song.artist)
                            ? song?.artist.map((a) => a.fullName).join(", ")
                            : song?.artist?.fullName || song?.artist}
                        </p>
                      </div>

                      {/* Song Duration */}
                      <div className="text-xs block sm:text-sm  lg:hidden xl:hidden 2xl:block text-gray-400 ml-4 flex-shrink-0">
                        {formatDuration(song.duration)}
                      </div>

                      {/* Options Button */}
                      <div className="ml-4 flex-shrink-0 block cursor-pointer lg:hidden xl:hidden 2xl:block">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => handleMenuToggle(song)}
                        >
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                          <circle cx="5" cy="12" r="2" fill="currentColor" />
                          <circle cx="19" cy="12" r="2" fill="currentColor" />
                        </svg>
                        {currentSong && currentSong._id === song._id && (
                          <SongAction
                            onClose={() => setCurrentSong(null)}
                            song={currentSong}
                          />
                        )}
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
    </>
  );
};

export default WeeklyTop15;
