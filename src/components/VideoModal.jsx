// components/VideoModal.js
import React from "react";

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
      <div className="bg-gray-900 rounded-lg overflow-hidden max-w-3xl w-full shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-white bg-red-500 rounded-full px-2 py-1 text-xs hover:bg-red-600"
          onClick={onClose}
        >
          ✕
        </button>
        <video
          src={video.url}
          controls
          autoPlay
          className="w-full h-[60vh] object-cover"
        />
        <div className="p-4 text-white">
          <h3 className="text-lg font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-400">
            {video.views?.toLocaleString()} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
