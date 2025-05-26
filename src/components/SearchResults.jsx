import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addSongToQueue, setIsPlaying ,addSongToQueueWithAuth} from "../features/musicSlice";
import axios from "axios";

import { AiFillPlayCircle } from "react-icons/ai";

const apiUrl = import.meta.env.VITE_API_URL;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const queryFromURL = searchParams.get("query");
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const [results, setResults] = useState({
    artists: [],
    albums: [],
    songs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const [currentSong, setCurrentSong] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const query = queryFromURL || searchQuery;

      if (query) {
        try {
          setLoading(true);
          const response = await axios.get(
            `${apiUrl}api/v1/home/searchAll`,
            {
              params: { query },
            }
          );
          setResults(response.data.data);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setError(
            err.response?.data?.message || "Error fetching search results"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [queryFromURL]);

  const handleSongClick = (song) => {
    setCurrentSong(song._id); // Mark the current song as playing
    dispatch(addSongToQueueWithAuth(song));
    dispatch(setIsPlaying(true));
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (
    !results?.artists?.length &&
    !results?.songs?.length &&
    !results?.albums?.length
  ) {
    return (
      <div className="text-white">
        No results found for "{queryFromURL || searchQuery}"
      </div>
    );
  }

  return (
    <div className="p-6 text-white mx-4 sm:mx-10 lg:mx-10 py-4 mt-5">
      <h1 className="text-2xl font-bold mb-4">
        Results for "{queryFromURL || searchQuery}"
      </h1>

      {results?.artists?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-cyan-500">Artists</h2>
          {results.artists.map((artist,index) => (
            <div
              key={index}
              className="flex items-center bg-gray-800 p-4 rounded-lg mb-4 cursor-pointer"
              onClick={() => navigate(`/artist/${artist._id}`)}
            >
              <img
                src={artist.coverImage}
                alt={artist.fullName}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="text-2xl">{artist.fullName}</h3>
                <p className="text-gray-400">Artist</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {results?.albums?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-cyan-500">Albums</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {results.albums.map((album,index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg cursor-pointer"  onClick={() => navigate(`/album/${album._id}`)}>
                <img
                  src={album.coverImage || "default-album.jpg"}
                  alt={album.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg">{album.title}</h3>
                <p className="text-gray-400">{album.artistInfo.fullName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results?.songs?.length > 0 && (
        <div>
       
          <h2 className="text-xl font-bold mb-4 text-cyan-500">Songs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-14">
            {results.songs.map((song,index) => (
              <div
                key={index}
             
                className="flex relative group items-center justify-between py-4 px-2 md:px-4  transition-colors duration-300 "
                 
              >
                <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r  rounded-s-2xl from-[#8e8e8e] to-transparent"></div>

                <div className="flex  w-full justify-center items-center">

                  <div className="relative w-24 h-12 cursor-pointer">
                    <img
                      src={song.coverImage}
                      alt="Album"
                      className="w-full h-full object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-50"
                    />
                    <AiFillPlayCircle
                      className="absolute inset-0 w-full h-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => handleSongClick(song)}
                    />
                  </div>
                  <div className="flex items-baseline w-full justify-start mx-2">
                    <div>
                      <p className="font-bold ">{song.title}</p>
                      <p className="text-sm text-gray-400">
                        {song.artistInfo.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="mr-2">
                    <p className="md:text-xs text-[10px]">{song.duration}</p>
                  </div>
                  <div className="text-right">
                    <button className="text-xl text-white">...</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
