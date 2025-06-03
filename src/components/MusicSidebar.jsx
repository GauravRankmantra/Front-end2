import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import ShareModal from "../modals/ShareModal";
import PlaylistSelectionModal from "../modals/PlaylistSelectionModal";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { useTranslation } from "react-i18next";
import addLike from "../utils/addLike";

const apiUrl = import.meta.env.VITE_API_URL;

const MusicSidebar =React.memo( ({ song, show }) => {
  const [expand, setExpand] = useState(false);
  const { t } = useTranslation();

  const dropdownRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [pModelOpen, setPModelOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const songId = song._id;
  const navigate = useNavigate();

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

  const handleAddToFav = () => {
    addLike({ songId })
      .then((response) => {
        // Handle the successful response

        toast.success("Added to favorites!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        // Handle errors

        toast.success(error?.response?.data?.message, {
          // Show error message
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
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
        toast.error("You don't have any playlists yet.", {
          position: "top-right",
        });
        return;
      }
      setUserPlaylists(playlists);
      setPModelOpen(true); // Open the playlist selection modal
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    }
  };

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
  };

  return (
    <div
      className={` transition-all  font-josefin-r  shadow-2xl h-[100%]  absolute z-10 rounded-e-2xl duration-300 flex bg-cyan-500 text-white items-center ${
        expand || show ? "w-max" : "w-0 md:w-20 lg:w-24 xl:w-2/12"
      }`}
    >
      <div className="w-full relative flex items-center">
        <div className="flex-shrink-0 flex items-center space-x-4">
          <img
            className="w-14 h-14 shadow-xl md:w-16 md:h-16 rounded object-cover"
            src={song.coverImage}
            alt={song.title}
          />

          {/* Song Title and Artist Info */}
          <div className="hidden xl:flex flex-col space-y-1 overflow-hidden">
            {/* Song Title */}
            <h1
              className={`text-lg text-start max-w-[120px]  font-semibold text-ellipsis overflow-hidden whitespace-nowrap
              ${expand && "max-w-max"}
              `}
            >
              {song.title}
            </h1>
            {/* Song Artist */}
            <h2 className="text-sm text-start max-w-[120px] text-ellipsis overflow-hidden whitespace-nowrap">
              {Array.isArray(song.artist) ? (
                song.artist.map((artistObj, index) => (
                  <span
                    key={index}
                    onClick={() => {
                      if (artistObj.fullName !== "Unknown Artist") {
                        navigate(`/artist/${artistObj._id}`);
                 
                      }
                    }}
                    className="cursor-pointer hover:underline"
                  >
                    {artistObj.fullName}
                    {index !== song.artist.length - 1 && ", "}
                  </span>
                ))
              ) : (
                <span>
                  {song.artist?.fullName || song.artist || "Unknown Artist"}
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div
          className={`flex-grow overflow-scroll no-scrollbar flex  justify-around items-center  space-x-6 transition-opacity duration-300 ${
            expand || show
              ? "opacity-100 visible ml-0"
              : "opacity-0 invisible ml-10"
          }
          
          `}
        >
          <button
            onClick={handleDownloadClick}
            className={`flex ${
              show && `flex-col space-x-1`
            } justify-center items-center space-x-2 text-sm`}
          >
            <IoCloudDownloadOutline className="w-5 h-5" />
            <span className="lg:text-sm text-xs"> {t("download")}</span>
          </button>

          <button
            onClick={handleAddToFav}
            className={`flex ${
              show && "flex-col pl-0 space-x-1"
            } justify-center items-center space-x-2 text-sm border-l border-gray-100 pl-4`}
          >
            <CiHeart className="w-5 h-5" />
            <span className="lg:text-sm text-xs">{t("addToFav")}</span>
          </button>

          <button
            onClick={handleAddToPlaylist}
            className={`flex ${
              show && "flex-col pl-0 space-x-1"
            } justify-center items-center space-x-2 text-sm border-l border-gray-100 pl-4`}
          >
            <MdOutlinePlaylistAdd className="w-5 h-5" />
            <span className="lg:text-sm text-xs"> {t("addToPlaylist")}</span>
          </button>

          <button
            onClick={() => handleShare({ songId: song._id })}
            className={`flex ${
              show && "flex-col pl-0 space-x-1"
            } justify-center items-center space-x-2 text-sm border-l border-gray-100 pl-4`}
          >
            <IoCloudDownloadOutline className="w-5 h-5" />
            <span className="lg:text-sm text-xs">{t("share")}</span>
          </button>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpand(!expand)}
          className={`absolute px-1 right-0 hidden md:hidden lg:flex  w-7 h-7 bg-cyan-500 rounded-full  justify-center items-center ${
            expand && "translate-x-7"
          }`}
        >
          {expand ? (
            <MdOutlineExpandCircleDown className="  rotate-90 w-7 h-7" />
          ) : (
            <MdOutlineExpandCircleDown className="-rotate-90 w-7 h-7" />
          )}
        </button>
      </div>
      {isModalOpen && shareData && (
        <ShareModal
          shareUrl={shareData.shareUrl}
          socialMediaLinks={shareData.socialMediaLinks}
          onClose={() => setModalOpen(false)}
        />
      )}
      {pModelOpen && (
        <PlaylistSelectionModal
          playlists={userPlaylists}
          onSelect={onPlaylistSelected}
          onClose={() => setPModelOpen(false)}
        />
      )}
    </div>
  )
});

export default MusicSidebar;
