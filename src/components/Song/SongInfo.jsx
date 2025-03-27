import React from "react";
import { useLocation } from "react-router-dom";

const SongInfo = () => {
  const location = useLocation();
  const song = location.state?.song;

  if (!song) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-2xl font-semibold">No song details available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
            {song.title}
          </h1>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-lg mb-8">
          <img
            className="w-full h-auto object-cover"
            src={song.coverImage || "https://dummyimage.com/600x400"}
            alt={song.title}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <p className="text-lg font-semibold mb-2">Artist: <span className="font-normal">{song.artist}</span></p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <p className="text-lg font-semibold mb-2">Album: <span className="font-normal">{song.album || "Unknown"}</span></p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <p className="text-lg font-semibold mb-2">Genre: <span className="font-normal">{song.genre || "Unknown"}</span></p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-md">
            <p className="text-lg font-semibold mb-2">
              Duration: <span className="font-normal">{Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongInfo;