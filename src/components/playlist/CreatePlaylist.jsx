import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Loading from "../Loading";
import "react-toastify/dist/ReactToastify.css";

import {
  setPlaylistName,
  setDescription,
  fetchTopSongs,
  searchSongs,
  addSong,
  removeSong,
  createPlaylist,
} from "../../features/playlistSlice";

const CreatePlaylist = () => {
  const dispatch = useDispatch();
  const {
    name,
    songs,
    availableSongs,
    loading: playlistLoading,
    error,
    description,
  } = useSelector((state) => state.playlist); // Renamed to playlistLoading
  const [searchQuery, setSearchQuery] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const isFormValid = name.trim() && songs.length > 0 && coverImage;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTopSongs()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      dispatch(fetchTopSongs()).then(() => setLoading(false));
    } else {
      dispatch(searchSongs(searchQuery)).then(() => setLoading(false));
    }
  }, [searchQuery, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleSongSelection = (song) => {
    if (songs.some((s) => s._id === song._id)) {
      dispatch(removeSong(song._id));
    } else {
      if (songs.length >= 20) {
        toast.warning("You can select up to 20 songs only.");
        return;
      }
      dispatch(addSong(song));
    }
  };

  const handleCreatePlaylist = () => {
    if (!name.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }
    if (songs.length === 0) {
      toast.error("Select at least one song");
      return;
    }
    if (!coverImage) {
      toast.error("Please upload a cover image");
      return;
    }
    setLoading(true);
    dispatch(createPlaylist({ name, songs, description, coverImage })).then(
      () => {
        setCoverImage(null);
        setCoverPreview(null);
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-2xl mt-24 mx-auto p-6 bg-gray-800 text-white space-y-2 rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold mb-4">Create Playlist</h1>
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="flex justify-center py-2 items-center">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex justify-center items-center">
                  <span className="text-gray-400">Upload Image</span>
                </div>
              )}

              {isHovered && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  {coverPreview ? (
                    <button
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrashAlt size={24} />
                    </button>
                  ) : (
                    <label
                      htmlFor="imageInput"
                      className="text-white hover:text-gray-300"
                    >
                      <FaEdit size={24} />
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
          <input
            type="text"
            placeholder="Enter playlist name"
            value={name}
            onChange={(e) => dispatch(setPlaylistName(e.target.value))}
            className="w-full p-2 mb-4 text-black rounded-md"
          />

          <textarea
            type="text"
            placeholder="description"
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
            className="w-full p-2 mb-4 text-black rounded-md"
          />
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search songs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 text-black rounded-md"
            />
            <button className="p-2 bg-blue-500 rounded-md">
              <FaSearch className="text-white" />
            </button>
          </div>
          <p className="mb-2">Selected Songs: {songs.length}/20</p>
          {playlistLoading && <p>Loading songs...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="max-h-64 overflow-y-auto bg-gray-800 p-2 space-y-2 rounded-md no-scrollbar">
            {availableSongs.length > 0 ? (
              availableSongs.map((song) => (
                <div
                  key={song._id}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    songs.some((s) => s._id === song._id)
                      ? "bg-cyan-500"
                      : "bg-gray-700"
                  } hover:bg-cyan-400 transition-all rounded-md mb-1`}
                  onClick={() => handleSongSelection(song)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-center items-center space-x-1">
                      <img
                        className="w-10 h-10 rounded-xl"
                        src={song.coverImage}
                        alt={song.title}
                      />
                      <span>{song.title}</span>
                    </div>
                    <div>
                      <p className="text-[#dedede] text-[12px]">
                        {Array.isArray(song?.artist)
                          ? song.artist.map((artist, index) => (
                              <span key={index}>
                                {artist.fullName}
                                {index !== song.artist.length - 1 && ", "}
                              </span>
                            ))
                          : song?.artist?.fullName || "Unknown Artist"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No songs found</p>
            )}
          </div>
          <button
            onClick={handleCreatePlaylist}
            className={`w-full mt-4 p-2 rounded-md transition-all ${
              isFormValid
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Create Playlist
          </button>
        </>
      )}
    </div>
  );
};

export default CreatePlaylist;
