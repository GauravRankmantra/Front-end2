// src/playlist/PlayListContainer.js
import React from 'react';

const PlayListContainer2 = ({ playlists }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
                <div key={playlist._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200 ease-in-out">
                    <img
                        src={playlist.coverImage || 'https://via.placeholder.com/150?text=No+Cover'} // Fallback image
                        alt={playlist.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold truncate mb-1">{playlist.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{playlist.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{playlist.totalSongs} songs</p>
                        {/* You could add more details or a link to the playlist detail page here */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlayListContainer2;