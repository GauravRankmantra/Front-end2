import React, { useEffect, useState, useRef } from "react";

const Recently = ({ heading, link }) => {
  const scrollContainerRef = useRef(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${link}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data && data.data) {
          setAlbums(data.data);
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
    scrollContainerRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className="relative px-4 sm:px-10 lg:px-36 mt-6">
      <div className="w-full mb-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          {heading}
          <div className="absolute bottom-0 left-[-15px] w-[100px] h-[5px] bg-gradient-to-r from-[#3bc8e7] to-transparent"></div>
        </h1>
      </div>

      <div className="relative">
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#3bc8e7] text-white p-2 rounded-full hover:bg-[#2b9bb2] z-10 transition hidden sm:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Album List */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 py-4 w-full overflow-x-scroll scroll-smooth no-scrollbar"
        >
          {loading && <p className="text-white text-center">Loading albums...</p>}
          {error && <p className="text-white">Error: {error}</p>}

          {!loading && !error && albums.length > 0 ? (
            albums.map((album) => (
              <div key={album._id} className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px]">
                <div className="text-center">
                  <div className="relative overflow-hidden rounded-[10px] aspect-square">
                    <img
                      className="w-full h-full object-cover rounded-[10px]"
                      src={album.coverImage || "https://dummyimage.com/150x150"}
                      alt={album.title}
                    />
                  </div>

                  <div className="text-left mt-4">
                    <h3 className="text-[14px] mb-[5px]">
                      <a href="#" className="text-white hover:text-[#3bc8e7]">
                        {album.title}
                      </a>
                    </h3>
                    <p className="text-[#dedede] text-[12px]">{album?.artist?.fullName}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && !error && <p className="text-white">No albums available</p>
          )}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#3bc8e7] text-white p-2 rounded-full hover:bg-[#2b9bb2] z-10 transition hidden sm:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Recently;
