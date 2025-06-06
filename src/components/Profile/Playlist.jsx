import React, { useEffect, useState } from "react";
import PlayListContainer from "../playlist/PlayListContainer";
import axios from "axios";
import Loading from "../Loading";

const apiUrl = import.meta.env.VITE_API_URL;

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        setLoading(true); // Indicate loading has started
        setError(null); // Clear any previous errors

        const response = await axios.get(
          `${apiUrl}api/v1/playlist/userPlaylists`,
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.data) {
          setPlaylists(response.data.data);
        } else {
          setError(
            "API response structure is unexpected: Missing playlist data."
          );
          setPlaylists([]); // Ensure playlists array is empty
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);

        if (err.response) {
          // Server responded with a status other than 2xx
          setError(
            err.response.data.message ||
              "Server error: Could not fetch playlists."
          );
        } else if (err.request) {
          setError(
            "Network error: No response received from server. Please check your connection."
          );
        } else {
          setError(
            "An unexpected error occurred while setting up the request: " +
              err.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Edge case: No playlists returned by the API
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-xl text-gray-700">
          You don't have any playlists yet!
        </p>
        <p className="text-gray-600 mt-2">
          Start by creating your first playlist.
        </p>
      </div>
    );
  }

  // --- Render Playlists ---
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Your Playlists</h1>

      <PlayListContainer playlist={playlists} />
    </div>
  );
};

export default Playlist;
