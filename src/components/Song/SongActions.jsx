import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlineHeart,
  AiOutlinePlus,
  AiOutlineDownload,
  AiOutlineUnorderedList,
  AiOutlineShareAlt,
} from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import ShareModal from "../../modals/ShareModal";
import addLike from "../../utils/addLike";
import { useTranslation } from "react-i18next";
import {
  addSongToQueue,
  setIsPlaying,
  addSongToQueueWithAuth,
} from "../../features/musicSlice";
import PlaylistSelectionModal from "../../modals/PlaylistSelectionModal";
import { useDispatch, useSelector } from "react-redux";

const apiUrl = import.meta.env.VITE_API_URL;

const SongActions = ({ onClose, song }) => {
    const { t } = useTranslation();
  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [pModelOpen, setPModelOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const songId = song._id;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const onPlaylistSelected = async (selectedPlaylistObj) => {
    setSelectedPlaylist(selectedPlaylistObj._id);
    setPModelOpen(false);

    let res; // Declare res outside try block to avoid reference errors

    try {
      res = await axios.post(`${apiUrl}api/v1/playlist/singlSong`, {
        playlistId: selectedPlaylistObj._id,
        songId: song._id,
      });

      if (res.status === 200) {
        toast.success("Song added to playlist!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (addSongError) {
      console.error("Error adding song", addSongError);

      if (addSongError.response) {
        // Handle specific errors from the API response
        if (addSongError.response.status === 400) {
          toast.error(addSongError.response.data.message || "Bad request", {
            position: "top-right",
          });
        } else if (addSongError.response.status === 500) {
          toast.error("Server error, please try again later.", {
            position: "top-right",
          });
        } else {
          toast.error(
            `Error: ${
              addSongError.response.data.message || "Something went wrong"
            }`,
            { position: "top-right" }
          );
        }
      } else {
        // Handle network errors
        toast.error("Network error, please check your connection.", {
          position: "top-right",
        });
      }
    }

    onClose();
  };

  const handleDownload = async () => {

    const songId = song._id;
    let artistIds = [];

    if (typeof song.artist === "string") {
      artistIds.push(song.artist._id);
    } else if (Array.isArray(song.artist)) {
      artistIds = song.artist
        .filter((artist) => artist && artist._id)
        .map((artist) => artist._id);
    } else {
      console.warn("song.artist is not a string or an array:", song.artist);
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}api/v1/song/isPurchased/${songId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.isPurchased) {
        toast.success("Download started");
        try {
          const response = await axios.post(
            `${apiUrl}api/v1/userStats/addDownloadStats`,
            { songId, artistIds }
          );
        } catch (error) {
          console.log("error while update download stats", error);
        }
        const audioResponse = await axios.get(song.audioUrls.high, {
          responseType: "blob",
        });

        const audioBlob = audioResponse.data;
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob);
        downloadLink.href = url;
        downloadLink.download = `${song.title}.mp3`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
      } else {
        toast.error("Download not allowed. Purchase the song first.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data?.message === "Unauthorized: You Need to Login"
      ) {
        toast.error("You need to login for this functionality.");
      } else {
        toast.error("An error occurred while checking purchase status.");
        console.error(error);
      }
    }
  };

  const handleDownloadClick = async () => {
    await handleDownload();
    onClose();
  };

  const handleAddToFav = (songId) => {
    addLike({ songId })
      .then((response) => {
        toast.success("Added to favorites!");
        onClose();
      })
      .catch((error) => {
        // Handle errors

        toast.error(error.response.data.message);
      });
  };

  const handleAddToQueue = () => {
    try {
      if (!isAuthenticated) {
        toast.error("You Need To Login ");
        return;
      }
      dispatch(addSongToQueueWithAuth(song));
      dispatch(setIsPlaying(false));
      toast.success("Added to queue!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }

    onClose();
  };

  const handleAddToPlaylist = async () => {
    try {
      // 1. Fetch user's playlists
      const playlistsRes = await axios.get(
        `${apiUrl}api/v1/playlist/userPlaylists`,
        { withCredentials: true }
      );
      const playlists = playlistsRes?.data?.data;

      if (!playlists || playlists.length === 0) {
        toast.error("You don't have any playlists yet.");
        return;
      }
      setUserPlaylists(playlists);
      setPModelOpen(true); // Open the playlist selection modal
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleShare = ({ songId, albumId }) => {
    // Define the base URL dynamically
    const publicBaseUrl = `https://odgmusic.com`;
    const shareUrl = albumId
      ? `${publicBaseUrl}/album/${albumId}`
      : `${publicBaseUrl}/song/${songId}`;

    // Message to be shared
    const message = encodeURIComponent(
      `Check out this amazing music: ${shareUrl}`
    );

    // Social media sharing links
    const socialMediaLinks = {
      whatsapp: `https://wa.me/?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      x: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${message}`,
      instagram: "https://www.instagram.com/", // Instagram does not support direct link sharing
    };

    // Open the Share Modal
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
        className="absolute md:overflow-hidden overflow-scroll right-8 w-24 h-28 md:w-auto md:h-auto m-auto md:max-w-fit rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in"
      >
        <div className="md:py-1">
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200 "
            onClick={() => handleAddToFav(song._id)}
          >
            <AiOutlineHeart className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            {t("addToFav")}
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToQueue}
          >
            <AiOutlinePlus className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            {t("addToQueue")}
          </button>
          <button
            className="flex  items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleDownloadClick}
          >
            <AiOutlineDownload className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            {t("download")}
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={handleAddToPlaylist}
          >
            <AiOutlineUnorderedList className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            {t("addToPlaylist")}
          </button>
          <button
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleShare({ songId: song._id })}
          >
            <AiOutlineShareAlt className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            {t("share")}
          </button>
          {isModalOpen && shareData && (
            <ShareModal
              shareUrl={shareData.shareUrl}
              socialMediaLinks={shareData.socialMediaLinks}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
        {pModelOpen && (
          <PlaylistSelectionModal
            playlists={userPlaylists}
            onSelect={onPlaylistSelected}
            onClose={() => setPModelOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default SongActions;
