import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SongList from "../Song/SongList";

import AlbumCard from "./AlbumCard";
import NewReleases from "../NewReleases";
import { useDispatch } from "react-redux";
import { addPlaylistToQueue, clearQueue ,setIsPlaying,addPlaylistToQueueWithAuth } from "../../features/musicSlice";
const apiUrl = import.meta.env.VITE_API_URL;

const PlaylistInfo = () => {
  const { id } = useParams();
  const userInfo = useSelector((state) => state.user.user);
  const currentUserId = userInfo?._id;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [artist, setArtist] = useState("");
  const [activePopup, setActivePopup] = useState(null);

  const dispatch = useDispatch();

  const handelMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${apiUrl}api/v1/playlist/${id}`
        );
        setAlbum(res?.data?.data);
       
        setSongs(res?.data?.data?.songs);

        setArtist(res?.data?.data?.artistDetails?.fullName);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const handelPlayAll = () => {
    dispatch(clearQueue());
   
    dispatch(addPlaylistToQueueWithAuth(songs));
    dispatch(setIsPlaying(true))
    
    setDisableBtn(!disableBtn);
  };

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
    return (
      <>
        {minutes}:{seconds}
      </>
    );
  };

  const handleAddToFavourites = async (songId) => {
    try {
      await axios.post(
        `${apiUrl}api/v1/favourites`,
        {
          userId: currentUserId,
          albumId: id,
          songId,
        }
      );
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
    <div className="shadow-2xl overflow-hidden rounded-lg">
      <div className="bg-[#151d30] py-16 px-4 sm:px-6 lg:px-8  text-white w-full font-sans">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-60 h-60 bg-gray-300 flex justify-center items-center rounded-lg mb-4 md:mb-0">
            <img
              src={album.coverImage || "https://dummyimage.com/240x240/000/fff"}
              alt="Album Cover"
            />
          </div>

          <div className="ml-0 md:ml-8 w-full md:w-auto">
            <h2 className="text-3xl md:text-4xl font-bold">{album.title}</h2>
            <p className="text-gray-400">
              By - {album?.owner?.fullName}
            </p>
            <p className="text-gray-400">
              {album.totalSongs} songs || {formatDuration(album.totalDuration)}
            </p>
            <p className="text-gray-400">
              Released {formatDate(album.releaseDate)} | {album.company}
            </p>

            <div className="mt-4 flex justify-center  items-center  flex-row gap-4">
              <div className="flex space-x-2">
                
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
          </div>


        </div>

        <div className="mt-20">
          {songs && songs.length > 0 ? (
            <SongList songs={songs} artist={artist} />
          ) : (
            <p>No songs available for this album.</p>
          )}
        </div>
      </div>

      
      <div className="mt-10">
        <AlbumCard
          heading={"You May Also Like"}
          link={
            `${apiUrl}api/v1/albums/featureAlbums`
          }
        />
      </div>
      <div className="mt-5">
        <NewReleases />
      </div>
      <div className="mt-24"></div>
    </div>
  );
};

export default PlaylistInfo;
