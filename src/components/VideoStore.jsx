import React, { useEffect, useState } from "react";
import VideoGallery from "./VideoGallery";

import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const VideoStore = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState(null);
  const incrementView = async (id) => {
    try {
      await axios.post(`${apiUrl}api/v1/AdminVideo/${id}/views`);
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  useEffect(() => {
    const fetchVideUrl = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}api/v1/AdminVideo`); // Fetch all videos
        if (Array.isArray(data)) {
          setVideos(data);
        } else if (data && typeof data === "object") {
        
          setVideos([data]);
          console.warn(
            "API returned a single video object where an array was expected. Wrapping in array."
          );
        } else {
        
          setVideos([]);
        }
      } catch (error) {
        console.log("error while fetching video url ", error);
      }
    };
    fetchVideUrl();
  }, []);
  return (
    <div className="mt-10">
      <VideoGallery videos={videos} />


    </div>
  );
};

export default VideoStore;
