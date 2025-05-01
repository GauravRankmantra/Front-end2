import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  addSongToQueue,
  clearQueue,
  addPlaylistToQueueWithAuth,
  setIsPlaying,
} from "../features/musicSlice";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import Loading from "../components/Loading";

const GenreInfo = () => {
  const { name } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [genres, setGenres] = useState([]);
    const [disableBtn, setDisableBtn] = useState(false);

  const location = useLocation();
  const id = location.state?.genreId;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`${apiUrl}api/v1/genre/${id}`); // Send genreId as a path parameter
        setGenres(res.data.data); // Assuming your backend returns { success: true, data: genre }
       
      } catch (err) {
        console.error("Failed to fetch genre:", err);
        // Optionally set an error state to display an error message to the user
        // setError("Failed to load genre.");
      }
    };

    if (id) {
      // Only fetch if genreId is available
      fetchGenres();
    }
  }, [id]);

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
        const response = await axios.get(`${apiUrl}api/v1/song/genre/${name}`);
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
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSongClick = (song) => {
    dispatch(addSongToQueueWithAuth(song));
    dispatch(setIsPlaying(true));
  };
  const handelPlayAll = () => {
    dispatch(clearQueue());

    dispatch(addPlaylistToQueueWithAuth(songs));
    dispatch(setIsPlaying(true));

    setDisableBtn(!disableBtn);
  };

  return (
    <div className="relative mx-4 mt-14 sm:mx-10 lg:mx-10">
      <div className="flex items-center justify-center border border-gray-700">
        <img className=" w-[30%] " src={genres.image}></img>
        <div className="text-white p-2 space-y-5">
          <h1 className="md:text-4xl text-2xl text-cyan-500 font-bold">{genres.name}</h1>
          <p className="md:w-[50%] text-sm md:text-lg text-gray-500">{genres.discription}</p>
          <div>
            <button
              disabled={disableBtn}
              onClick={handelPlayAll}
              className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-full flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
              Play All
            </button>

          </div>
        </div>
      </div>
      <div className="w-full my-6">
        <h1 className="text-lg pb-2 relative inline-block text-capitalize text-[#3bc8e7]">
          Songs
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
                    <h1 className="text-[14px] mb-[5px]">
                      <a href="#" className="text-white hover:text-[#3bc8e7]">
                        {song.title}
                      </a>
                    </h1>
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
