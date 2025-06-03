import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillPlayCircle } from "react-icons/ai";
import AlbumActions from "./AlbumActions";
import SongShimmer from "../Shimmer/SongShimmer";

const Recently = ({ heading, link, type }) => {
  const scrollContainerRef = useRef(null);
  const [albums, setalbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [currentAlbum, setCurrentAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${link}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data && data.data) {
          setalbums(data.data);
      
        } else {
          setError("No albums available");
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

  const handelClick = (album) => {
    if (type == "playlist") {
      navigate(`/playlist/${album._id}`);
    } else {
      navigate(`/album/${album._id}`);
    }
    // Go to the top of the screen after navigation
    window.scrollTo(0, 0);
  };

  const handleMenuToggle = (album) => {
    if (currentAlbum && currentAlbum._id === album._id) {
      setCurrentAlbum(null);
    } else {
      setCurrentAlbum(album);
    }
  };
  return (
    <div className="relative mx-2 sm:mx-10 lg:mx-10 ">
      <div className="w-full mb-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          {heading}
          <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
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
      {loading ? (
        <SongShimmer /> // Show shimmer when loading
      ) : (
        <div className="relative">
          {/* Scrollable album List */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 py-4 w-full overflow-x-scroll scroll-smooth no-scrollbar"
          >
            {error && <p className="text-white">Error: {error}</p>}

            {!loading && !error && albums.length > 0
              ? albums.map((album) => (
                  <div
                    key={album._id}
                    className="relative flex-shrink-0 w-[120px] sm:w-[150px] md:w-[190px] group cursor-pointer"
                  >
                    <div
                      className="relative overflow-hidden rounded-[10px] aspect-square group"
                      onMouseLeave={() => setCurrentAlbum(null)}
                    >
                       <div className="absolute inset-0 translate-y-36 group-hover:translate-y-0 z-40 bg-gradient-to-t from-cyan-500 to-transparent flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] transition-all duration-500"></div>
                      <img
                        className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
                        src={
                          album.coverImage || "https://dummyimage.com/150x150"
                        }
                        alt={album.title}
                      />
                      <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-1000">
                        <AiFillPlayCircle
                          className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                          onClick={() => handelClick(album)}
                        />
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute top-2 right-2 w-5 h-5 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                          onClick={() => handleMenuToggle(album)}
                        >
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                          <circle cx="5" cy="12" r="2" fill="currentColor" />
                          <circle cx="19" cy="12" r="2" fill="currentColor" />
                        </svg>

                        {currentAlbum && currentAlbum._id === album._id && (
                          <AlbumActions
                            onClose={() => setCurrentAlbum(null)}
                            album={currentAlbum}
                          />
                        )}
                      </div>
                    </div>

                    <div className="text-left mt-4">
                      <div className="text-[14px] border border-gray-800 p-1 rounded-lg flex justify-between  mb-[5px]">
                        <button
                          onClick={() => handelClick(album)}
                          className="text-white w-5/12 text-start overflow-hidden truncate hover:text-[#3bc8e7]"
                        >
                          {album.title}
                        </button>
                        <h2 className="text-gray-300 space-x-2">
                          <span>total songs : </span>
                          {album?.totalSongs}
                        </h2>
                      </div>
                     
                      <p className="text-[#dedede] text-[12px]">
                        {album?.artist?.fullName}
                      </p>
                    </div>
                  </div>
                ))
              : !loading &&
                !error && <p className="text-white">No albums available</p>}
          </div>
        </div>
      )}

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
