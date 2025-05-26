import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
  clearQueue
  
} from "../features/musicSlice";
import cart from "../assets/svg/artist.svg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import Loading from "../components/Loading";
import { AiFillPlayCircle } from "react-icons/ai";
import { addPlaylistToQueueWithAuth } from "../features/musicSlice";

const GenreInfo = () => {
  const { name } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [genres, setGenres] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.genreId;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
  const handelBuyNowClick = (song) => {
    if (isAuthenticated) {
      navigate(`/purchased?id=${encodeURIComponent(song._id)}`);
    } else {
      toast.loading("Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
        toast.dismiss();
      }, 700);
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
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
    if (!isAuthenticated) {
      dispatch(setloginPopupSong(song));
      dispatch(setShowLoginPopup(true));
    }
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
          <h1 className="md:text-4xl text-2xl text-cyan-500 font-bold">
            {genres.name}
          </h1>
          <p className="md:w-[50%] text-sm md:text-lg text-gray-500">
            {genres.discription}
          </p>
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
            ? songs.map((song, index) => (
                <div
                  key={index}
                  className="relative  flex-shrink-0 w-[120px]  sm:w-[150px] md:w-[190px] group "
                >
                  <div
                    className="relative  overflow-hidden rounded-[10px] aspect-square group"
                    // onMouseLeave={() => setCurrentSong(null)} // Hide menu on mouse leave
                  >
                    <img
                      className="w-full h-full object-cover rounded-[10px] transition-opacity duration-300 group-hover:opacity-60"
                      src={song.coverImage || "https://dummyimage.com/150x150"}
                      alt={song.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <AiFillPlayCircle
                        className="w-12 h-12 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                        onClick={() => handleSongClick(song)}
                      />

                      {/* <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-2 right-2 w-5 h-5 text-white cursor-pointer transform transition-transform duration-300 hover:scale-110"
                        onClick={() => handleMenuToggle(song)}
                      >
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                        <circle cx="5" cy="12" r="2" fill="currentColor" />
                        <circle cx="19" cy="12" r="2" fill="currentColor" />
                      </svg> */}

                      {/* {currentSong && currentSong._id === song._id && (
                             <SongAction
                               onClose={() => setCurrentSong(null)}
                               song={currentSong}
                             />
                           )} */}
                    </div>
                    {song.price > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-full  px-4 py-1 rounded-full flex items-center justify-center gap-2 text-white text-sm font-medium shadow-lg transition-all">
                        {user?.purchasedSongs?.includes(song._id) ? (
                          <div className="bg-green-600 px-3 py-1 rounded-full flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>Purchased</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handelBuyNowClick(song)}
                            className="bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded-full flex items-center gap-2 transition-colors"
                          >
                            <img src={cart} className="w-4 h-4" alt="Cart" />
                            <span className="flex">
                              Buy
                              <span className="hidden md:block">_Now</span>
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-left mt-4">
                    <h1 className="text-[14px] mb-[5px]">
                      <a href="#" className="text-white hover:text-[#3bc8e7]">
                        {song.title}
                      </a>
                    </h1>
                    <p className="text-[#dedede] text-[12px]">
                      {Array.isArray(song?.artist)
                        ? song.artist.map((artist, index) => (
                            <span key={index}>
                              {artist.fullName}
                              {index !== song.artist.length - 1 && ", "}
                            </span>
                          ))
                        : song?.artist?.fullName ||
                          song?.artist ||
                          "Unknown Artist"}
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
