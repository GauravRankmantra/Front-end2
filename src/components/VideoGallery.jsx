import React, { useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import axios from "axios";
import { AiFillPlayCircle } from "react-icons/ai";
const apiUrl = import.meta.env.VITE_API_URL;

const VideoGallery = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playedVideos, setPlayedVideos] = useState(new Set());

  const handleVideoPlay = async (videoId) => {
    if (playedVideos.has(videoId)) return;

    console.log("View increment triggered for:", videoId);
    try {
      await axios.patch(`${apiUrl}api/v1/AdminVideo/${videoId}/views`);
      setPlayedVideos((prev) => new Set(prev).add(videoId));
    } catch (error) {
      console.error("Failed to update views:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-3xl text-center font-bold mb-8">
        Explore Our Videos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos?.length > 0 ? (
          videos.map((video) => (
        <div
          key={video._id}
          onClick={() => setSelectedVideo(video)}
          className="relative cursor-pointer border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className="p-4 absolute inset-0 bg-gradient-to-t from-cyan-500 via-cyan-500/70 to-transparent 
                      translate-y-full group-hover:-translate-y-0 
                      transition-transform duration-500 ease-in-out 
                      flex items-end justify-center h-full"
          >
            <AiFillPlayCircle className="w-10 h-10 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-2xl font-bold text-white mb-2">{video.title}</h3>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-semibold truncate">{video.title}</h3>
            <p className="text-sm text-gray-400">
              {video.views?.toLocaleString() || 0} views
            </p>
          </div>
        </div>
          ))
        ) : (
          <p className="text-center col-span-full">No videos available.</p>
        )}
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-4 text-3xl text-white"
            >
              &times;
            </button>

            <Plyr
              source={{
                type: "video",
                sources: [{ src: selectedVideo.url, provider: "html5" }],
              }}
              options={{ autoplay: true }}
              onPlay={() => handleVideoPlay(selectedVideo._id)}
            />

            <h3 className="mt-4 text-2xl font-bold text-white">
              {selectedVideo.title}
            </h3>
            <p className="text-gray-300">
              {selectedVideo.views?.toLocaleString() || 0} views
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
