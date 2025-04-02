import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SongList from "./Song/SongList";
import NewReleases from "./NewReleases";
import AlbumCard from "./Album/AlbumCard";
const apiUrl = import.meta.env.VITE_API_URL;

const ArtistInfo = () => {
  const { id } = useParams();
  const userInfo = useSelector((state) => state.user.user);
  const currentUserId = userInfo?._id;
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [activePopup, setActivePopup] = useState(null);

  function formatDuration(seconds) {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const handleMenuToggle = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${apiUrl}api/v1/user/artist${id}`);
        const artistData = res?.data?.data;

        setArtist(artistData);
        setSongs(artistData?.songs || []);
      } catch (err) {
        setError(err.response?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleAddToFavourites = async (songId) => {
    try {
      await axios.post(
        `${apiUrl}api/v1/favourites`,
        {
          userId: currentUserId,
          artistId: id,
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

  if (!artist) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-2xl font-semibold">
          No artist details available.
        </p>
      </div>
    );
  }

  return (
    <div className="shadow-2xl rounded-lg">
      <div className="bg-[#151d30] py-16 px-4 sm:px-6 lg:px-8  text-white w-full font-sans">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-60 h-60 bg-gray-300 flex justify-center items-center rounded-lg mb-4 md:mb-0">
            <img
              src={
                artist.coverImage || "https://dummyimage.com/240x240/000/fff"
              }
              alt="Artist Cover"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>

          <div className="ml-0 md:ml-8 w-full md:w-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              {artist.fullName}
            </h2>
            <p className="text-gray-400">
              {artist.bio ? artist.bio : "No biography available."}
            </p>
          </div>

          <div className="ml-0 md:ml-auto relative mt-4 md:mt-0">
            <button
              onClick={handleMenuToggle}
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
                <button
                  onClick={() => handleAddToFavourites(null)}
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  Add To Favourites
                </button>
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

        <div className="mt-20">
          {songs.length > 0 ? (
            <SongList songs={songs} artist={artist.fullName} />
          ) : (
            <p>No songs available for this artist.</p>
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

      <div className="mt-10">
        <NewReleases />
      </div>
    </div>
  );
};

export default ArtistInfo;
