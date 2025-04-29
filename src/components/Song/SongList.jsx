import React, { useContext, useState } from "react";
import { PlayCircle, Heart, MoreHorizontal, AudioLines } from "lucide-react"; // Lucide-react icons
import { useDispatch, useSelector } from "react-redux";
import ShareModal from "../../modals/ShareModal";
import PlaylistSelectionModal from "../../modals/PlaylistSelectionModal";

import {
  addSongToQueue,
  setIsPlaying,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import formatDuration from "../../utils/formatDuration";
import SongAction from "./SongActions";

const SongList = ({ songs, artist }) => {
  const [hoveredSongIndex, setHoveredSongIndex] = useState(null);
  const [playing, setPlayingSong] = useState(null);

  const currentSong = useSelector((state) => state.musicPlayer.currentSong);

  const dispatch = useDispatch();

  const handleMouseEnter = (index) => {
    setHoveredSongIndex(index);
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

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left text-sm text-gray-400">
        <thead className="text-xs uppercase text-gray-500">
          <tr>
            <th className="p-4 w-24 text-center">#</th>
            <th className="p-4">Song Title</th>
            <th className="p-4">Artist</th>
            <th className="p-4">Duration</th>
            <th className="p-4">Add To Favourites</th>
            <th className="p-4">More</th>
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
              onMouseLeave={handleMouseLeave}
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
              <td className="p-4">{song.title}</td>
              <td className="p-4">{artist}</td>
              <td className="p-4">{formatDuration(song.duration)}</td>
              <td className="p-4">
                <Heart className="w-5 h-5 hover:text-cyan-500 transition-colors duration-300" />
              </td>
              <td className="p-4">
                <div className="ml-4 flex-shrink-0 block cursor-pointer lg:hidden xl:hidden 2xl:block">
                  {playing && playing._id === song._id && (
                    <div className="translate-x-1 w-full">
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
