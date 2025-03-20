import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Recently = ({ heading, link }) => {
  const scrollContainerRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${link}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data && data.data) {
          setSongs(data.data);
        } else {
          setError("No songs available");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [link]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -180, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 180, behavior: "smooth" });
  };

  const handleSongClick = (song) => {
    navigate(`/song/${song._id}`, { state: { song } });
  };

  return (
    <div className="relative mx-4 sm:mx-10 lg:mx-10">
      <div className="w-full  mb-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          {heading}
          <div className="absolute bottom-0 left-[-15px] w-[100px] h-[5px] bg-gradient-to-r from-[#3bc8e7] to-transparent"></div>
        </h1>
      </div>
    
      <button
        onClick={scrollLeft}
        className="absolute -left-12 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full hover:bg-[#2b9bb2] z-10 transition hidden sm:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="relative">
        {/* Scrollable Song List */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 py-4 w-full overflow-x-scroll scroll-smooth no-scrollbar"
        >
          {loading && (
            <p className="text-white text-center">Loading songs...</p>
          )}
          {error && <p className="text-white">Error: {error}</p>}

          {!loading && !error && songs.length > 0
            ? songs.map((song) => (
                <div
                  key={song._id}
                  className="relative flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] group cursor-pointer"
                  onClick={() => handleSongClick(song)}
                >
                  <div className="relative overflow-hidden rounded-[10px] aspect-square">
                    <img
                      className="w-full h-full object-cover rounded-[10px] group-hover:opacity-50"
                      src={song.coverImage || "https://dummyimage.com/150x150"}
                      alt={song.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-12 h-12 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-5.804-3.37A1 1 0 008 8.617v6.766a1 1 0 001.532.848l5.804-3.37a1 1 0 000-1.696z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-left mt-4">
                    <h3 className="text-[14px] mb-[5px]">
                      <a href="#" className="text-white hover:text-[#3bc8e7]">
                        {song.title}
                      </a>
                    </h3>
                    <p className="text-[#dedede] text-[12px]">{song?.artist}</p>
                  </div>
                </div>
              ))
            : !loading &&
              !error && <p className="text-white">No songs available</p>}
        </div>
      </div>

      
      <button
        onClick={scrollRight}
        className="absolute -right-12 top-1/2 transform -translate-y-1/2  text-white p-2 rounded-full hover:bg-[#2b9bb2] z-10 transition hidden sm:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Recently;
