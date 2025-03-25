import React from 'react';
import { FaHeart, FaPlus, FaDownload, FaListUl, FaShareAlt } from 'react-icons/fa';

const SongMenu = () => {
  return (
    <div className="bg-white rounded-md shadow-md py-2 w-48">
      <ul className="text-gray-800">
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <FaHeart className="mr-2 text-gray-600" />
          Add To Favourites
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <FaPlus className="mr-2 text-gray-600" />
          Add To Queue
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <FaDownload className="mr-2 text-gray-600" />
          Download Now
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <FaListUl className="mr-2 text-gray-600" />
          Add To Playlist
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <FaShareAlt className="mr-2 text-gray-600" />
          Share
        </li>
      </ul>
    </div>
  );
};

export default SongMenu;