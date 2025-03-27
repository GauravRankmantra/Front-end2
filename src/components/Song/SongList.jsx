import React, { useContext, useState } from "react";
import { PlayCircle, Heart, MoreHorizontal } from "lucide-react"; // Lucide-react icons
import { useDispatch } from "react-redux";
import { addSongToQueue, setIsPlaying } from "../../features/musicSlice";
import formatDuration from "../../utils/formatDuration";

const SongList = ({ songs, artist }) => {
  const [hoveredSongIndex, setHoveredSongIndex] = useState(null);

  const dispatch = useDispatch();

  const handleMouseEnter = (index) => {
    setHoveredSongIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredSongIndex(null);
  };


  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left text-sm text-gray-400">
        <thead className="text-xs uppercase text-gray-500">
          <tr>
            <th className="p-4 w-10">#</th>
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
                hoveredSongIndex === index ? "text-teal-400" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <td className="p-4 w-10">
                {" "}
                {/* Fixed width to prevent shifting */}
                <div
                  onClick={() =>
                    dispatch(addSongToQueue(song), setIsPlaying(true))
                  }
                  className="flex items-center justify-center"
                >
                  {hoveredSongIndex === index ? (
                    <PlayCircle className="text-teal-400 w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
              </td>
              <td className="p-4">{song.title}</td>
              <td className="p-4">{artist}</td>
              <td className="p-4">{formatDuration(song.duration)}</td>
              <td className="p-4">
                <Heart className="w-5 h-5 hover:text-teal-400 transition-colors duration-300" />
              </td>
              <td className="p-4">
                <MoreHorizontal className="w-5 h-5 hover:text-teal-400 transition-colors duration-300" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongList;
