import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlineHeart,
  AiOutlinePlus,
  AiOutlineDownload,
  AiOutlineUnorderedList,
  AiOutlineShareAlt,
} from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShareModal from "../../modals/ShareModal";
import { addPlaylistToQueue, setIsPlaying } from "../../features/musicSlice";
import { useDispatch } from "react-redux";
import PlaylistSelectionModal from "../../modals/PlaylistSelectionModal";
const apiUrl = import.meta.env.VITE_API_URL;

const AlbumActions = ({ onClose, album }) => {
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const albumId = album?._id;
  const [song, setSong] = useState([]);
  const dispatch = useDispatch();

  // Playlist states
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [pModelOpen, setPModelOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //         onClose();
  //       }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [onClose]);

  const handelDownload = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}api/v1/album/isPurchased/${albumId}`,
        { withCredentials: true }
      );

      if (response.data.isPurchased) {
        toast.success("Download started", {
          position: "top-right",
          autoClose: 3000,
        });

        // Fetch the blob data
        const audioResponse = await axios.get(album.audioUrls.high, {
          responseType: "blob",
        });
        const audioBlob = audioResponse.data;

        // Create and click the download link
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob);
        downloadLink.href = url;
        downloadLink.download = `${album.title}.mp3`;
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
      } else if (response.data.isPurchased === false) {
        toast.error("Download not allowed. Purchase the album first.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Unauthorized: You Need to Login"
      ) {
        toast.error("Please login to download the album.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("Error checking purchase status", error);
        toast.error("An error occurred while checking purchase status.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleDownloadClick = async () => {
    await handelDownload();
    onClose();
  };

  const handleAddToFav = () => {
    toast.success("Added to favorites!", {
      position: "top-right",
      autoClose: 3000,
    });
    onClose();
  };

  const handleAddToQueue = async () => {
    try {
      const res = await axios.get(`${apiUrl}api/v1/albums/${albumId}`);
      const songs = res?.data?.data?.songs;

      if (!songs || songs.length === 0) {
        toast.error("This album doesn't contain any songs.", {
          position: "top-right",
        });
        return;
      }

      setSong(songs);
      dispatch(addPlaylistToQueue(songs));
      dispatch(setIsPlaying(true));

      toast.success("Added all songs to queue!", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error fetching album songs:", error);
      toast.error("Failed to add songs to queue. Please try again.", {
        position: "top-right",
      });
    }
  };

  // This function now opens a modal for playlist selection instead of window.prompt.
  const handleAddToPlaylist = async () => {
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
      setUserPlaylists(playlists);
      setPModelOpen(true); // Open the playlist selection modal
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to fetch playlists. Please try again.", {
        position: "top-right",
      });
    }
  };

  // Called when the user selects a playlist from the modal UI
  const onPlaylistSelected = async (selectedPlaylistObj) => {
    setSelectedPlaylist(selectedPlaylistObj._id);
    setPModelOpen(false);
    try {
      // 3. Fetch album songs
      const res = await axios.get(`${apiUrl}api/v1/albums/${albumId}`);
      const songs = res?.data?.data?.songs;

      if (!songs || songs.length === 0) {
        toast.error("This album doesn't contain any songs.", {
          position: "top-right",
        });
        return;
      }

      // 4. Add songs to the selected playlist
      for (const song of songs) {
        try {
          await axios.post(`${apiUrl}api/v1/playlist/singlSong`, {
            playlistId: selectedPlaylistObj._id,
            songId: song._id,
          });
        } catch (addSongError) {
          console.error("Error adding song", addSongError);
          if (addSongError.response?.status === 400) {
            toast.error(addSongError?.response?.data?.message, {
              position: "top-right",
            });
          } else {
            toast.error("Error adding some songs, please try again", {
              position: "top-right",
            });
          }
        }
      }

      toast.success("Songs added to playlist!", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error adding songs to playlist:", error);
      toast.error("Failed to add songs to playlist. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleShare = ({ albumId }) => {
    const shareUrl = `https://odgmusic.netlify.app/album/${albumId}`;
    const message = encodeURIComponent(
      `Check out this amazing album on odg music: ${shareUrl}`
    );

    const socialMediaLinks = {
      whatsapp: `https://wa.me/?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      x: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${message}`,
      instagram: "https://www.instagram.com/",
    };

    openShareModal({ shareUrl, socialMediaLinks });
  };

  const openShareModal = ({ shareUrl, socialMediaLinks }) => {
    setShareData({ shareUrl, socialMediaLinks });
    setModalOpen(true);
  };

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute md:overflow-hidden overflow-scroll right-8 w-24 h-28 md:w-auto md:h-auto m-auto md:max-w-fit rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in"
      >
        <div className="md:py-1">
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToFav}
          >
            <AiOutlineHeart className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Add To Fav
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToQueue}
          >
            <AiOutlinePlus className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Add To Queue
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleDownloadClick}
          >
            <AiOutlineDownload className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Download
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToPlaylist}
          >
            <AiOutlineUnorderedList className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Add To Playlist
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleShare({ albumId: "67d01b3117cdbb2f4ea0c29b" })}
          >
            <AiOutlineShareAlt className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            Share
          </button>
          {isModalOpen && shareData && (
            <ShareModal
              shareUrl={shareData.shareUrl}
              socialMediaLinks={shareData.socialMediaLinks}
              //   onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      </div>
      {/* Render Playlist Selection Modal if open */}
      {pModelOpen && (
        <PlaylistSelectionModal
          playlists={userPlaylists}
          onSelect={onPlaylistSelected}
          onClose={() => setPModelOpen(false)}
        />
      )}
    </>
  );
};

export default AlbumActions;
