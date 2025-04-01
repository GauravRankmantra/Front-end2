import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import formatDuration from "../utils/formatDuration";
import { useDispatch } from "react-redux";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToHistory,
} from "../features/musicSlice";

const SearchResultsDisplay = ({ results, setInputValue }) => {
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);
  const [show, setShow] = useState(true);
  const dispatch = useDispatch(); // Corrected: Call useDispatch as a function

  const handleAlbumRedirect = (id) => {
    setInputValue("");
    setShow(false);
    navigate(`/album/${id}`);
  };
  const handleSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueue(song));
    dispatch(setIsPlaying(true));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handelCloseBtn = () => {
    setInputValue("");
    setShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      className="bg-gray-900  border border-gray-800 shadow-2xl absolute w-full m-auto mt-24 px-24 z-50 text-gray-300 "
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
          <div className="mb-8 w-full">
            <div className="flex flex-col  space-x-8 ">
              {results.artists.map((artist) => (
                <div
                  key={artist._id}
                  className="bg-gray-800 flex justify-evenly items-center rounded-lg shadow-md p-4 transition-transform duration-300"
                >
                  <div className="rounded-full">
                    <img
                      src={
                        artist.coverImage || "https://dummyimage.com/150x150"
                      }
                      alt={artist.fullName}
                      className="w-24 h-24 object-cover rounded-full mb-4"
                    />
                    <h3 className="text-lg font-semibold text-white">
                      {artist.fullName}
                    </h3>
                  </div>

                  <div>
                    <h1 className="text-center">Songs</h1>
                    <div className=" grid grid-cols-2 gap-2 rounded-xl shadow-2xl p-2">
                      {artist.songs.map((song) => (
                        <div
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
                  <div>
                    <h1 className="text-center">Albums</h1>
                    <div className=" grid grid-cols-2 gap-2 rounded-xl shadow-2xl p-2">
                      {artist.albums.map((album) => (
                        <div
                          onClick={() => {
                            handelAlbumRedirect(album._id);
                          }}
                          className="flex hover:bg-[#34384d] rounded-xl justify-start space-x-2 space-y-2 p-1  items-center"
                        >
                          <div className="w-16 h-16">
                            <img
                              className="object-cover rounded-full"
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
          <div className="mb-8  w-full">
            {/* <h2 className="text-xl font-semibold mb-4 text-cyan-400">Albums</h2> */}
            <div className="flex justify-center  w-full">
              {results.albums.map((album) => (
                <div
                  key={album._id}
                  className="bg-gray-800 mx-5 flex justify-center items-baseline rounded-lg shadow-md p-4 transition-transform duration-300"
                >
                  <div
                    onClick={() => {
                      handelAlbumRedirect(album._id);
                    }}
                    className="flex flex-col mx-1 justify-center items-center"
                  >
                    <h1 className="text-center">Album</h1>
                    <img
                      src={album.coverImage || "https://dummyimage.com/151x151"}
                      alt={album.title}
                      className="w-24 h-24 object-cover rounded-full mb-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {album.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {formatDate(album.releaseDate)}
                      </p>
                      <h3 className="text-white">
                        By{" "}
                        <span className="underline text-gray-400 cursor-pointer">
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Songs</h2>
            <div className="flex ">
              {results.songs.map((song) => (
                <div
                  key={song._id}
                  className="bg-gray-800 flex mx-5 flex-col rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div
                    onClick={() => handleSongClick(song)}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={song.coverImage || "https://dummyimage.com/151x151"}
                      alt={song.title}
                      className="w-24 h-24 object-cover rounded-md mb-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {song.title}
                      </h3>
                      <p className="text-gray-400">
                        Duration: {formatDuration(song.duration)}
                      </p>
                      <p className="text-gray-400">
                        By{" "}
                        <span className="text-gray-400 cursor-pointer underline">
                          {song.artistInfo.fullName}
                        </span>
                      </p>
                    </div>
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
                            Release Date: {formatDate(
                              song.albumInfo.releaseDate
                            )}
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
