import React from "react";

const PlaylistSelectionModal = ({ playlists, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Select Playlist</h2>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              className="cursor-pointer p-2 hover:bg-gray-200 rounded flex items-center"
              onClick={() => onSelect(playlist)}
            >
              <img
                src={playlist.coverImage}
                alt={playlist.name}
                className="w-12 h-12 rounded mr-2 object-cover"
              />
              <div>
                <div className="font-semibold text-black text-start">{playlist.name}</div>
                <div className="text-sm text-gray-500 text-start">
                  {playlist.totalSongs} Songs
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PlaylistSelectionModal;
