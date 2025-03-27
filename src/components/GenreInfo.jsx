import React, { useEffect, useState } from "react";
import axios from "axios";
import { addSongToQueue, setIsPlaying } from "../features/musicSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const GenreInfo = () => {
  const { name } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleResponse = (response) => {
    const songsData = response.data.songs;

    if (Array.isArray(songsData)) {
      setSongs(songsData);
    } else {
      setSongs([songsData]);
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://backend-music-xg6e.onrender.com/api/v1/song/genre/${name}`
        );
        handleResponse(response);
      } catch (err) {
        setError("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSongClick = (song) => {
    dispatch(addSongToQueue(song));
    dispatch(setIsPlaying(true));
  };

  return (
    <div className="relative mx-4 mt-14 sm:mx-10 lg:mx-10">
      <div className="w-full mb-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          {name}
          <div className="absolute bottom-0 w-[100px] h-[2px] bg-gradient-to-r rounded-s-2xl from-[#3bc8e7] to-transparent"></div>
        </h1>
      </div>

      <div className="relative">
        {/* Grid for Song List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-4">
          {loading && (
            <p className="text-white text-center">Loading songs...</p>
          )}
          {error && <p className="text-white">Error: {error}</p>}

          {!loading && !error && songs.length > 0
            ? songs.map((song) => (
              
                <div
                  key={song._id}
                  className="relative group cursor-pointer"
                  onClick={() => handleSongClick(song)}

                >
                  {console.log(song)}
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
                    <p className="text-[#dedede] text-[12px]">
                      {song?.artist?.fullName}
                    </p>
                  </div>
                </div>
              ))
            : !loading &&
              !error && <p className="text-white">No songs available</p>}
        </div>
      </div>
    </div>
  );
};

export default GenreInfo;
