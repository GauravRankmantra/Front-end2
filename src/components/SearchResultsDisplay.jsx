import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import formatDuration from "../utils/formatDuration";
import { useDispatch, useSelector } from "react-redux";
import cart from "../assets/svg/artist.svg";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
} from "../features/musicSlice";

const SearchResultsDisplay = ({ results, setInputValue }) => {
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);
  const [show, setShow] = useState(true);
  const dispatch = useDispatch(); // Corrected: Call useDispatch as a function


  const user = useSelector((state) => state.user.user);

  const handelAlbumRedirect = (id) => {
    setInputValue("");
    setShow(false);
    navigate(`/album/${id}`);
  };
  const handleSongClick = (song) => {
    setInputValue("");
    setShow(false);
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));
    dispatch(setIsPlaying(true));
  };
  const handleartistClick = (id) => {
    setInputValue("");
    setShow(false);
    navigate(`/artist/${id}`);
  };
  const handelBuyNowClick = (song) => {
    setShow(false);
    navigate(`/purchased?id=${encodeURIComponent(song._id)}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handelCloseBtn = () => {
    setInputValue("");
    setShow(false);
  };

  if (
    !results?.artists?.length &&
    !results?.albums?.length &&
    !results?.songs?.length
  ) {
    return null;
  }

  if (!show) return null;

  return (
    <div
      className="bg-gray-800  border border-gray-800 shadow-2xl absolute w-full m-auto mt-24 md:px-24 px-2 z-50 text-gray-300 "
      ref={searchResultsRef}
    >
      <div className="container mx-auto">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6 text-white">Search Results</h1>
          <button
            onClick={handelCloseBtn}
            className="bg-red-600 w-8 h-8 text-center rounded-full text-white text-xs px-2"
          >
            X
          </button>
        </div>

        {/* Artists Section */}
        {results?.artists?.length > 0 && (
          <div className="mb-8 w-full border-b border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Artist</h2>
            <div className="flex flex-col  space-x-8 md:space-y-0 space-y-8 ">
              {results.artists.map((artist) => (
                <div
                  key={artist._id}
                  className="bg-gray-800 flex flex-col md:space-y-0 space-y-8   lg:flex-row justify-evenly items-center rounded-lg shadow-md md:p-4 p-1 transition-transform duration-300"
                >
                  <div
                    onClick={() => handleartistClick(artist._id)}
                    className="rounded-full"
                  >
                    <img
                      src={
                        artist.coverImage || "https://dummyimage.com/150x150"
                      }
                      alt={artist.fullName}
                      className="w-24 h-24 object-cover rounded-full mb-4"
                    />
                    <h3 className="text-lg  font-semibold text-white">
                      {artist.fullName}
                    </h3>
                  </div>

                  <div>
                    <h1 className=" md:text-center text-start font-semibold">
                      Songs
                    </h1>
                    <div className="grid grid-cols-2 gap-2 rounded-xl shadow-2xl p-2">
                      {artist.songs.map((song) => (
                        <div
                          key={song._id}
                          onClick={() => handleSongClick(song)}
                          className="flex hover:bg-[#34384d] rounded-xl justify-start space-x-2 space-y-2 p-1 items-center"
                        >
                          <div className="w-16 h-16">
                            <img
                              className="object-cover w-16 h-16 cursor-pointer rounded-2xl"
                              src={song.coverImage}
                              alt={song.title}
                            ></img>
                          </div>
                          <div>
                            <h1 className="cursor-pointer">{song.title}</h1>
                            <p className="text-gray-400 text-xs">
                              {formatDuration(song.duration)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h1 className="md:text-center text-start font-semibold">
                      Albums
                    </h1>
                    <div className=" grid grid-cols-2 gap-2 rounded-xl shadow-2xl p-2">
                      {artist.albums.map((album) => (
                        <div
                          key={album._id}
                          onClick={() => {
                            handelAlbumRedirect(album._id);
                          }}
                          className="flex hover:bg-[#34384d] rounded-xl justify-start space-x-2 space-y-2 p-1  items-center"
                        >
                          <div className="w-16 h-16">
                            <img
                              className="  w-16 h-16 object-cover rounded-full"
                              src={
                                album.coverImage ||
                                "https://dummyimage.com/150x150"
                              }
                              alt={album.title}
                            ></img>
                          </div>
                          <div>
                            <h1>{album.title}</h1>
                            <p className="text-gray-400 text-xs">
                              {formatDate(album.releaseDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums Section */}
        {results?.albums?.length > 0 && (
          <div className="mb-8  w-full border-b border-gray-600 ">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Albums</h2>
            <div className="flex flex-col shadow-2xl justify-start  w-full">
              {results.albums.map((album) => (
                <div
                  key={album._id}
                  className="bg-gray-800 mx-5 space-x-5 border border-gray-600 flex flex-col md:flex-row space-y-4 md:space-y-0 justify-center items-center rounded-lg shadow-md p-4 transition-transform duration-300"
                >
                  <div className="flex flex-col mx-1 justify-center items-center">
                    <img
                      onClick={() => {
                        handelAlbumRedirect(album._id);
                      }}
                      src={album.coverImage || "https://dummyimage.com/151x151"}
                      alt={album.title}
                      className="w-24 h-24 object-cover cursor-pointer rounded-full mb-4"
                    />
                    <div>
                      <h3
                        onClick={() => {
                          handelAlbumRedirect(album._id);
                        }}
                        className="text-lg font-semibold text-white cursor-pointer"
                      >
                        {album.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {formatDate(album.releaseDate)}
                      </p>
                      <h3 className="text-white">
                        By{" "}
                        <span
                          onClick={() =>
                            handleartistClick(album.artistInfo._id)
                          }
                          className="underline text-gray-400 cursor-pointer"
                        >
                          {album.artistInfo.fullName}
                        </span>
                      </h3>
                    </div>
                  </div>
                  <div></div>
                  <div>
                    {album.songs?.length > 0 && (
                      <div className="mx-1">
                        <h1 className="text-center">Songs</h1>
                        <div className=" grid grid-cols-2 gap-2 rounded-xl shadow-2xl p-2">
                          {album.songs.map((song) => (
                            <div
                              key={song._id}
                              onClick={() => handleSongClick(song)}
                              className="flex hover:bg-[#34384d] rounded-xl justify-start space-x-2 space-y-2 p-1 items-center"
                            >
                              <div className="w-16 h-16">
                                <img
                                  className="object-cover rounded-2xl"
                                  src={song.coverImage}
                                  alt={song.title}
                                ></img>
                              </div>
                              <div>
                                <h1>{song.title}</h1>
                                <p className="text-gray-400 text-xs">
                                  {formatDuration(song.duration)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Songs Section */}
        {results?.songs?.length > 0 && (
          <div className="mb-8 border-b border-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Songs</h2>
            <div className="flex flex-col ">
              {results.songs.map((song) => (
                <div
                  key={song._id}
                  className="bg-gray-800  flex mx-5 flex-col border border-gray-600 rounded-lg shadow-md p-4 transition-transform duration-300 "
                >
                  <div className=" flex items-center space-x-2">
                    <img
                      onClick={() => handleSongClick(song)}
                      src={song.coverImage || "https://dummyimage.com/151x151"}
                      alt={song.title}
                      className="w-24  h-24 object-cover rounded-md mb-4 cursor-pointer"
                    />

                    <div>
                      <h3
                        onClick={() => handleSongClick(song)}
                        className="text-lg font-semibold text-white cursor-pointer"
                      >
                        {song.title}
                      </h3>
                      <p className="text-gray-400">
                        Duration: {formatDuration(song.duration)}
                      </p>
                      <p className="text-gray-400">
                        By{" "}
                        <span
                          onClick={() => handleartistClick(song.artistInfo._id)}
                          className="text-gray-400 cursor-pointer underline"
                        >
                          {song.artistInfo.fullName}
                        </span>
                      </p>
                    </div>
                    
                    {song.price > 0 && (
                      <>
                        {user?.purchasedSongs?.includes(song._id) ? (
                          <div className=" flex justify-center items-center space-x-1  bg-green-600 text-white rounded-xl px-3 py-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-white"
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
                          <div className=" flex justify-center items-center space-x-1 bottom-1 bg-blue-600 text-white rounded-xl px-3 py-1">
                            <img
                              src={cart}
                              className="w-5 h-5 text-white"
                              alt="Cart"
                            />
                            <button onClick={() => handelBuyNowClick(song)}>
                              Buy Now
                            </button>
                          </div>
                        )}
                      </>
                    )}

                  </div>

                  {song.albumInfo && (
                    <div className="mt-2 ">
                      <h4 className="text-md font-semibold text-gray-200">
                        Album:
                      </h4>
                      <div
                        onClick={() => {
                          handelAlbumRedirect(song.albumInfo._id);
                        }}
                        className="flex items-center justify-start space-x-1"
                      >
                        <img
                          src={
                            song.albumInfo.coverImage ||
                            "https://dummyimage.com/151x151"
                          }
                          alt={song.albumInfo.title}
                          className="w-16 h-16 rounded-md mt-2"
                        />
                        <div>
                          <p className="text-gray-400">
                            {song.albumInfo.title}
                          </p>
                          <p className="text-gray-400">
                            Release Date:{" "}
                            {formatDate(song.albumInfo.releaseDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsDisplay;
