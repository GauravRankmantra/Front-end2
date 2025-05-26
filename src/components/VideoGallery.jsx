import axios from "axios";
import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const VideoGallery = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Call API to update views when a video is selected
  useEffect(() => {
    if (selectedVideo) {
      const updateViews = async () => {
        try {
          // You might want to debounce or throttle this API call
          // if users click videos very rapidly to avoid overwhelming your backend.
          await axios.patch(
            `${apiUrl}api/v1/AdminVideo/${selectedVideo._id}/views`
          );
          // Optional: Update the views count in the local state for immediate feedback
          // This would require a way to update the 'videos' prop or manage it locally.
        } catch (error) {
          console.error("Failed to update views:", error);
          // Consider showing a user-friendly error message
        }
      };

      updateViews();
    }
  }, [selectedVideo]);

  // Handle keyboard escape for modal close
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    if (selectedVideo) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedVideo]);


  return (
    <div className="p-4 sm:p-6 lg:p-8 border rounded-lg border-gray-600 min-h-screen bg-gray-900"> {/* Added subtle background color */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mb-8 text-center">
        Explore Our Video Collection
      </h2> {/* More prominent title */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {videos?.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={video._id || index} // Use unique ID if available, fallback to index
              className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl
                         transform hover:-translate-y-1 transition-all duration-300
                         cursor-pointer border border-gray-100/10" // Enhanced borders and hover effects
              onClick={() => setSelectedVideo(video)} // Clicking the card opens the modal
            >
              <div className="aspect-w-16 aspect-h-9 w-full bg-black relative"> {/* Ensures consistent aspect ratio */}
                {/* --- START OF THUMBNAIL DISPLAY CHANGES --- */}
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title || "Video Thumbnail"}
                    className="w-full h-full object-cover transition-transform duration-300 "
                  />
                ) : (
                  // Fallback if no thumbnail URL is available
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 12h.01M12 10.5v1.5M12 13.5v1.5M4 12c0-1.882 1.401-3.65 3.5-4.5S11.5 6 12 6s3.5 0 5.5 1.5 3.5 2.618 3.5 4.5-1.401 3.65-3.5 4.5S12.5 18 12 18s-3.5 0-5.5-1.5-3.5-2.618-3.5-4.5z" />
                    </svg>
                    <p className="ml-2 text-lg">No Thumbnail</p>
                  </div>
                )}

                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* --- END OF THUMBNAIL DISPLAY CHANGES --- */}
              </div>

              <div className="p-3 bg-gray-700 flex flex-col justify-between h-auto">
                <h3 className="text-base font-semibold text-gray-100 truncate mb-1">
                  {video?.title || "Untitled Video"}
                </h3>
                <div className="flex items-center text-xs text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{video?.views?.toLocaleString() || '0'} views</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full py-10">
            No videos available at the moment. Please check back later!
          </p>
        )}
      </div>

      {/* Fullscreen Modal (remains the same, plays the actual video) */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full h-auto rounded-lg shadow-2xl bg-black overflow-hidden transform scale-95 animate-zoom-in"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside video container
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 text-white text-3xl z-50
                          hover:text-gray-300 transition-colors duration-200 focus:outline-none"
              aria-label="Close video player"
            >
              &times;
            </button>
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-white">
                <h3 className="text-2xl font-bold mb-1 drop-shadow-md">{selectedVideo.title}</h3>
                <p className="text-lg text-gray-300 drop-shadow-md">{selectedVideo.views?.toLocaleString() || '0'} views</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;