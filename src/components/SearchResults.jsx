import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const queryFromURL = searchParams.get("query");
  const searchQuery = useSelector((state) => state.search.searchQuery);

  const [artistData, setArtistData] = useState(null);
  const [albumsData, setAlbumsData] = useState([]);
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const query = queryFromURL || searchQuery;

    if (query) {
      setLoading(true);

      // Fetch artist data
      axios
        .get(`https://backend-music-xg6e.onrender.com/api/v1/user/search`, {
          params: { query: query },
        })
        .then((response) => {
          setArtistData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching artist data:", error);
        });

      // Fetch albums data
      axios
        .get(`https://backend-music-xg6e.onrender.com/api/v1/albums/search`, {
          params: { query: query },
        })
        .then((response) => {
          setAlbumsData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching albums data:", error);
        });

      // Fetch songs data
      axios
        .get(`https://backend-music-xg6e.onrender.com/api/v1/song/search`, {
          params: { query: query },
        })
        .then((response) => {
          setSongsData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching songs data:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [queryFromURL, searchQuery]);

  // Show loading indicator while fetching data
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  // If no results were found
  if (!artistData && songsData.length === 0 && albumsData.length === 0) {
    return (
      <div className="text-white">No results found for "{searchQuery}"</div>
    );
  }

  return (
    <div className="text-white p-6 m-24">
      {/* Artist Section */}
      {artistData && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Top result</h2>
          <div className="flex items-center bg-gray-800 p-4 rounded-lg">
            <img
              src={artistData.imageUrl}
              alt={artistData.name}
              className="w-20 h-20 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-2xl font-bold">{artistData.name}</h3>
              <p className="text-gray-400">Artist</p>
            </div>
          </div>
        </div>
      )}

      {/* Songs Section */}
      {songsData.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Songs</h2>
          <ul>
            {songsData.map((song) => (
              <li
                key={song.id}
                className="flex items-center justify-between mb-4 p-2 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={song.albumArtUrl}
                    alt={song.title}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-lg">{song.title}</h3>
                    <p className="text-gray-400">{song.artistName}</p>
                  </div>
                </div>
                <p className="text-gray-400">{song.duration}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Albums Section */}
      {albumsData.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {artistData ? `Featuring ${artistData.name}` : "Albums"}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {albumsData.map((album) => (
              <div key={album.id} className="bg-gray-800 p-4 rounded-lg">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg">{album.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
