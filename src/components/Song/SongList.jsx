import React, { useContext, useEffect, useState } from "react";
import { PlayCircle, Heart, MoreHorizontal, AudioLines } from "lucide-react"; // Lucide-react icons
import { useDispatch, useSelector } from "react-redux";
import ShareModal from "../../modals/ShareModal";
import PlaylistSelectionModal from "../../modals/PlaylistSelectionModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { TbMusicCheck } from "react-icons/tb";


import {
  addSongToQueue,
  setIsPlaying,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import formatDuration from "../../utils/formatDuration";
import SongAction from "./SongActions";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import addLike from "../../utils/addLike";

const SongList = ({ songs, artist, type }) => {
  const [hoveredSongIndex, setHoveredSongIndex] = useState(null);
  const [playing, setPlayingSong] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [pModelOpen, setPModelOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const currentSong = useSelector((state) => state.musicPlayer.currentSong);

  const dispatch = useDispatch();

  const handleMouseEnter = (index) => {
    setHoveredSongIndex(index);
  };

  const handleAddToFav = ({ songId }) => {
    addLike({ songId, dispatch })
      .then((response) => {
        // Handle the successful response

        toast.success("Added to favorites!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        // Handle errors

        toast.success(error?.response?.data?.message, {
          // Show error message
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const handleMenuToggle = (song) => {
    if (playing && playing._id === song._id) {
      setPlayingSong(null);
    } else {
      setPlayingSong(song);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSongIndex(null);
    setPlayingSong(null);
  };

  const handelBuyNowClick = (song) => {
    if (isAuthenticated) {
      navigate(`/purchased?id=${encodeURIComponent(song._id)}`);
    } else {
      toast.loading("Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
        toast.dismiss();
      }, 700);
    }
  };

  return (
    <div className="overflow-x-auto min-h-[40rem] max-h-[60rem] no-scrollbar bg-gray-900 font-josefin-r">
      <table className="table-auto w-full text-left text-sm text-gray-400">
        <thead className="text-xs w-full uppercase text-gray-500">
          <tr>
            <th className="p-4 w-24 text-center">#</th>
            <th className="p-4 min-w-[8.5rem] max-w-[9rem] truncate text-center">
              Song Title
            </th>
            <th className="p-4 text-center">Artist</th>
            <th className="p-4 text-center">Duration</th>
            <th className="p-4 text-center">Like</th>
            {type != "download" && <th className="p-4 text-center">Buy</th>}

            <th className="p-4 text-center">More</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={index}
              className={`border-b border-gray-700 hover:bg-gray-800 transition-colors duration-300 ${
                hoveredSongIndex === index ||
                (currentSong && currentSong._id === song._id)
                  ? "text-cyan-500"
                  : ""
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              // onMouseLeave={() => {
              //   setTimeout(() => {
              //     handleMouseLeave;
              //   }, 200);
              // }}
            >
              <td className="p-4 w-24">
                {" "}
                {/* Fixed width to prevent shifting */}
                <div
                  onClick={() => {
                    dispatch(addSongToQueueWithAuth(song));
                    dispatch(setIsPlaying(true));
                  }}
                  className="flex cursor-pointer items-center justify-center"
                >
                  {hoveredSongIndex === index ? (
                    currentSong?._id === song?._id ? (
                      <AudioLines className="text-cyan-500 w-5 h-5" />
                    ) : (
                      <PlayCircle className="text-cyan-500 w-5 h-5" />
                    )
                  ) : currentSong?._id === song?._id ? (
                    <AudioLines className="text-cyan-500 w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
              </td>
              <td className="p-4  flex justify-center">{song.title}</td>
              {type == "download" ? (
                <td className="whitespace-nowrap justify-center flex ">
                  {Array.isArray(song.artist) ? (
                    song.artist.map((artistObj, index) => (
                      <span
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(`/artist/${artistObj._id}`);
                        }}
                        className="cursor-pointer  hover:underline"
                      >
                        {artistObj.fullName}
                        {index !== song.artist.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>
                      {song.artist?.fullName || song.artist || "Unknown Artist"}
                    </span>
                  )}
                </td>
              ) : (
                <td className="p-4 text-center">{artist}</td>
              )}

              <td className="p-4 text-center">{song.duration}</td>
              <td className="p-4 cursor-pointer flex items-center justify-center">
                {user?.likedSongs?.includes(song._id) ? (
                  <FaHeart className="w-5 h-5 hover:text-gray-500 text-red-500 transition-colors duration-300" />
                ) : (
                  <div>
                    <Heart
                      onClick={() => handleAddToFav({ songId: song._id })}
                      className="w-5 h-5 hover:text-cyan-500 transition-colors duration-300"
                    />
                  </div>
                )}
              </td>
              {type != "download" && (
                <td>
                  {user.purchasedSongs?.includes(song._id) ? (
                    <div className="flex justify-center items-center">
                      <TbMusicCheck className="text-green-500"/>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => handelBuyNowClick(song)}
                        className="px-2 py-1 min-w-[5rem] rounded-lg bg-cyan-500 text-white "
                      >
                        Buy Now
                      </button>
                    </div>
                  )}
                </td>
              )}

              <td className="p-4">
                <div className="ml-4 relative flex-shrink-0 block cursor-pointer lg:hidden xl:hidden 2xl:block">
                  {playing && playing._id === song._id && (
                    <div className="absolute ">
                      {" "}
                      <SongAction
                        onClose={() => setPlayingSong(null)}
                        song={playing}
                      />
                    </div>
                  )}

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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
