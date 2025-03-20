import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import SongList from "./SongList";

const AlbumInfo = () => {
  const { id } = useParams();
  const userInfo = useSelector((state) => state.user.user);
  const currentUserId = userInfo._id;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState(null);
  const [activePopup, setActivePopup] = useState(null);

  const handelMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/albums/${id}`
        );
        setAlbum(res.data.data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${year}`;
  };

  const formatDuration = (durationInMinutes) => {
    if (typeof durationInMinutes !== "number") {
      return "00:00";
    }
    const totalSeconds = Math.round(durationInMinutes * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return  <>
    {minutes}:
    {seconds}
  </>
  };

  const handleAddToFavourites = async (songId) => {
    try {
      await axios.post(`http://localhost:5000/api/v1/favourites`, {
        userId: currentUserId,
        albumId: id,
        songId,
      });
      alert("Song added to favourites!");
    } catch (error) {
      console.error("Error adding song to favourites", error);
      alert("Failed to add to favourites");
    }
  };

  const togglePopup = (songId) => {
    setActivePopup((prevActive) => (prevActive === songId ? null : songId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading.... </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-2xl font-semibold">
          No album details available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] py-16 px-4 sm:px-6 lg:px-8 min-h-screen text-white font-sans">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-60 h-60 bg-gray-300 flex justify-center items-center rounded-lg mb-4 md:mb-0">
          <img
            src={album.coverImage || "https://dummyimage.com/240x240/000/fff"}
            alt="Album Cover"
          />
        </div>

        <div className="ml-0 md:ml-8 w-full md:w-auto">
          <h2 className="text-3xl md:text-4xl font-bold">{album.title}</h2>
          <p className="text-gray-400">By - {album.artistDetails.fullName}</p>
          <p className="text-gray-400">
            {album.totalSongs} songs || {formatDuration(album.totalDuration)}
          </p>
          <p className="text-gray-400">
            Released {formatDate(album.releaseDate)} | {album.company}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-full flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
              Play All
            </button>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-full flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 3h14v2H4V3zm0 7h10v2H4v-2zm0 7h14v2H4v-2z" />
              </svg>
              Add To Queue
            </button>
          </div>
        </div>

        <div className="ml-0 md:ml-auto relative mt-4 md:mt-0">
          <button
            onClick={handelMenu}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {menu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                Add To Favourites
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                Add To Queue
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                Download Now
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                Add To Playlist
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                Share
              </a>
            </div>
          )}
        </div>
      </div>
      {/* <div className="overflow-x-auto">
        <table className="w-full mt-8 text-left border-collapse border-none">
          <thead>
            <tr className="border-b border-gray-600 md:text-lg text-xs">
              <th className="py-2">#</th>
              <th>Song Title</th>
              <th>Artist</th>
              <th>Duration</th>
              <th>Add To Favourites</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody className="border-collapse border-none md:text-sm text-xs">
            {album.songs.map((song, index) => (
              <tr key={song._id} className="border-b p-2 border-gray-700">
                <td className="">{index + 1}</td>
                <td>{song.title}</td>
                <td>{album.artistDetails.fullName}</td>
                <td>{formatDuration(song.duration)}</td>
                <td>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleAddToFavourites(song._id)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </button>
                </td>
                <td className="">
                  <button
                    className="text-gray-400 hover:text-gray-200"
                    onClick={() => togglePopup(song._id)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                  {activePopup === song._id && (
                    <div className="absolute right-0 bg-white text-black rounded shadow-lg p-2 text-sm">
                      <a href="#" className="block px-4 py-2">
                        Add To Favourites
                      </a>
                      <a href="#" className="block px-4 py-2">
                        Download
                      </a>
                      <a href="#" className="block px-4 py-2">
                        Add To Queue
                      </a>
                      <a href="#" className="block px-4 py-2">
                        Add To Playlist
                      </a>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      {/* <SongList/> */}
    </div>
  );
};

export default AlbumInfo;
