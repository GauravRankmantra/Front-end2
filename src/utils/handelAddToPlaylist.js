import axios from "axios";
import PlaylistSelectionModal from "../modals/PlaylistSelectionModal"
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
const handleAddToPlaylist = async () => {
    const [model,setModel]=useState(false)
    const [playlist,setplaylist]=useState()
    try {
      // 1. Fetch user's playlists
      const playlistsRes = await axios.get(
        `${apiUrl}api/v1/playlist/userPlaylists`,
        { withCredentials: true }
      );
      const playlists = playlistsRes?.data?.data;

      if (!playlists || playlists.length === 0) {
        toast.error("You don't have any playlists yet.", {
          position: "top-right",
        });
        return;
      }
      setplaylist(playlists);
      setModel(true); 
      {setModel && (
        <PlaylistSelectionModal
          playlists={playlist}
          onSelect={onPlaylistSelected}
          onClose={() => setModel(false)}
        />
      )}
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    }
  };

  export default handleAddToPlaylist