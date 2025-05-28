import React, { useEffect, useState } from "react";
import PlayListContainer from "../playlist/PlayListContainer"; // Ensure this path is correct
import axios from "axios";
import Loading from "../Loading";

// IMPORTANT: In a real application, you should manage your API URL
// using environment variables for different deployment environments.
// Example for development: Create a .env file in your project root with:
// REACT_APP_API_URL=http://localhost:8000/
const apiUrl = import.meta.env.VITE_API_URL; // Fallback for local dev

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
            withCredentials: true, // Crucial for sending cookies (e.g., authentication tokens)
          }
        );

        // The response structure shows playlists are in 'response.data.data'
        if (response.data && response.data.data) {
          setPlaylists(response.data.data);
        } else {
          // Handle cases where 'data' or 'data.data' might be missing from the response
          setError(
            "API response structure is unexpected: Missing playlist data."
          );
          setPlaylists([]); // Ensure playlists array is empty
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
        // Detailed error handling for various Axios error types
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(
            err.response.data.message ||
              "Server error: Could not fetch playlists."
          );
        } else if (err.request) {
          // Request was made but no response received (e.g., network error)
          setError(
            "Network error: No response received from server. Please check your connection."
          );
        } else {
          // Something else happened in setting up the request
          setError(
            "An unexpected error occurred while setting up the request: " +
              err.message
          );
        }
      } finally {
        setLoading(false); // Loading is complete (either success or error)
      }
    };

    fetchUserPlaylists(); // Execute the fetch operation when component mounts
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // --- Conditional Rendering for UI Feedback ---

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
        <p className="text-gray-600 mt-2">Please try again later.</p>
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
        {/* You might want to add a button here to navigate to a "create playlist" page */}
        {/* <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Create New Playlist
                </button> */}
      </div>
    );
  }

  // --- Render Playlists ---
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Your Playlists</h1>
      {/* PlayListContainer will receive the fetched playlists */}
      <PlayListContainer playlist={playlists} />
    </div>
  );
};

export default Playlist;
