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
import { useTranslation } from "react-i18next";
import { addPlaylistToQueueWithAuth, setIsPlaying } from "../../features/musicSlice";
import { useDispatch, useSelector } from "react-redux";
import PlaylistSelectionModal from "../../modals/PlaylistSelectionModal";
const apiUrl = import.meta.env.VITE_API_URL;

const AlbumActions = ({ onClose, album }) => {
  const dropdownRef = useRef(null);
    const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const albumId = album?._id;
  const [song, setSong] = useState([]);
  const dispatch = useDispatch();

  // Playlist states
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [pModelOpen, setPModelOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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

  const handleAddToFav = () => {
      if (!isAuthenticated) {
            toast.error("You Need To Login ");
            return;
          }
    toast.success("Added to favorites!", {
      position: "top-right",
      autoClose: 3000,
    });
    onClose();
  };

  const handleAddToQueue = async () => {
    try {
        if (!isAuthenticated) {
              toast.error("You Need To Login ");
              return;
            }
      const res = await axios.get(`${apiUrl}api/v1/albums/${albumId}`);
      const songs = res?.data?.data?.songs;

      if (!songs || songs.length === 0) {
        toast.error("This album doesn't contain any songs.");
        return;
      }

      setSong(songs);
      dispatch(addPlaylistToQueueWithAuth(songs));
      dispatch(setIsPlaying(true));

      toast.success("Added all songs to queue!");
      onClose();
    } catch (error) {
      console.error("Error fetching album songs:", error);
      toast.error("Failed to add songs to queue. Please try again.");
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
        toast.error("You don't have any playlists yet.");
        return;
      }
      setUserPlaylists(playlists);
      setPModelOpen(true); // Open the playlist selection modal
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to fetch playlists. Please try again.");
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
    const shareUrl = `https://odgmusic.com/album/${albumId}`;
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
            className="flex items-center w-full px-4 py-2 md:text-xs text-[8px] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
            onClick={() => handleShare({ albumId: "67d01b3117cdbb2f4ea0c29b" })}
          >
            <AiOutlineShareAlt className="md:mr-2 mr-1 md:h-4 md:w-4 w-2 h-2 text-gray-500" />
            {t("share")}
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
