import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ShareModal from "../modals/ShareModal";
const apiUrl = import.meta.env.VITE_API_URL;
import { FaChevronDown } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { useTranslation } from "react-i18next";

import "../index.css";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaList,
  FaVolumeUp,
} from "react-icons/fa"; // Import icons
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";

import { GoPlay } from "react-icons/go";
import { IoPauseCircleOutline } from "react-icons/io5";
import { FaChevronUp } from "react-icons/fa6";
import PlaylistSelectionModal from "../modals/PlaylistSelectionModal";
import { FaChevronCircleUp } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import { IoIosRepeat } from "react-icons/io";
import formateDuration from "../utils/formatDuration";
import addLike from "../utils/addLike";

import {
  playNextSong,
  playPrevSong,
  setIsPlaying,
  addSongToHistory,
  addSongToQueueWithAuth,
  addSongToQueue,
  seek,
  clearQueue,
  toggleRepeat,
  shufflePlaylist,
} from "../features/musicSlice";
import { useNavigate } from "react-router-dom";

const MusicSidebar = ({ song, show }) => {
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
  console.log("song info at music sidebar ", song);
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

  const handelDownload = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}api/v1/song/isPurchased/${song._id}`,
        { withCredentials: true }
      );

      if (response.data.isPurchased) {
        toast.success("Download started", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Fetch the blob data
        const audioResponse = await axios.get(song.audioUrls.high, {
          responseType: "blob", // Important: Get the response as a blob
        });

        const audioBlob = audioResponse.data;

        // Create a download link for the blob
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob); // Create a blob URL
        downloadLink.href = url;
        downloadLink.download = `${song.title}.mp3`; // Set the desired filename
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up
        window.URL.revokeObjectURL(url); // Release the blob URL
        document.body.removeChild(downloadLink);
      } else if (response.data.isPurchased === false) {
        toast.error("Download not allowed. Purchase the song first.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Unauthorized: You Need to Login"
      ) {
        toast.error("Please login to download the song.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error checking purchase status", error);
        toast.error("An error occurred while checking purchase status.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  const handleDownloadClick = async () => {
    await handelDownload();
  };

  return (
    <div
      className={` transition-all shadow-2xl py-2 pr-2  absolute z-10 rounded-e-2xl duration-300 flex bg-cyan-500 text-white items-center ${
        expand || show ? "max-w-max" : "w-16 lg:w-24 xl:w-2/12"
      }`}
    >
      <div className="w-full relative flex items-center">
        <div className="flex-shrink-0 flex items-center space-x-4">
          <img
            className="w-12 h-12 shadow-xl md:w-16 md:h-16 rounded-lg object-cover"
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
                        console.log(artistObj.fullName, " ", artistObj._id);
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
  );
};

const formatDuration = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showSlider, setShowSlider] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openQuality, setOpenQuality] = useState(false);
  const [quality, setQuality] = useState("high");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showsetting, setShowSetting] = useState(false);
    const { t } = useTranslation();

  const isShuffle = useSelector((state) => state.musicPlayer.isShuffle);
  const isRepeat = useSelector((state) => state.musicPlayer.isRepeat);

  const handelQualityClick = (type) => {
    setQuality(type);
    if (audioRef.current && currentSong) {
      const newSrc =
        type === "low" ? currentSong.audioUrls.low : currentSong.audioUrls.high;
      if (audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;

        audioRef.current.load();
        if (isPlaying) {
          audioRef.current
            .play()
            .catch((err) => console.error("Play error:", err));
        }
      }
    }
  };

  const currentSong = useSelector(
    (state) => state.musicPlayer?.currentSong || null
  );
  const playlist = useSelector((state) => state.musicPlayer?.playlist || []);
  const isPlaying = useSelector(
    (state) => state.musicPlayer?.isPlaying || false
  );
  const currentSongIndex = useSelector(
    (state) => state.musicPlayer?.currentSongIndex || 0
  );
  const handelQueueSongClick = (song) => {
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueueWithAuth(song));

    dispatch(setIsPlaying(true));
  };

  const toggleSlider = () => {
    setShowSlider(!showSlider);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error(err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    if (currentSong) {
      if (audioRef.current.src !== currentSong.audioUrls.low) {
        audioRef.current.src = currentSong.audioUrls.low;
        const loadAndPlay = async () => {
          try {
            await audioRef.current.load();
            if (isPlaying) {
              await audioRef.current.play();
            }
          } catch (err) {
            console.error("Error loading/playing new song:", err);
          }
        };
        loadAndPlay();
      } else if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.error("Play error:", err));
      }
    }
  }, [currentSong, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (!isNaN(dur) && dur > 0) {
        setCurrentTime(current);
        setProgress((current / dur) * 100);
        setDuration(dur);
      }
    }
  };

  const handleSeekChange = (e) => {
    const value = e.target.value;
    setProgress(value);
    setIsDragging(true);
  };

  const handleSeekMouseUp = async (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    setIsDragging(false);

    audioRef.current.pause();
    audioRef.current.currentTime = newTime;

    await new Promise((resolve) => setTimeout(resolve, 100));
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error(err));
    }
    setCurrentTime(newTime);
  };

  const handleNext = () => {
    dispatch(playNextSong());
  };

  const handlePrev = () => {
    dispatch(playPrevSong());
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Play error:", err));
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  const togglePlaylist = () => {
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-800  flex justify-between items-center text-white z-50 text-center">
        {/* <p className="text-white text-center font-bold">
          No song is currently playing
        </p> */}
      </div>
    );
  }

  return (
    <div
      className={`fixed   bottom-0 left-0 w-full z-50 text-white text-center transition-all duration-300 ${
        isExpanded ? "h-max py-5 " : " py-0 h-20"
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${currentSong.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`relative flex w-full items-center ${
          isExpanded ? "flex-col pl-5 pr-5 md:pr-16" : "pl-0 pr-10 md:pr-16"
        }`}
      >
        {!isExpanded && <MusicSidebar song={currentSong} />}

        {isExpanded && (
          <div className="border border-gray-500/30 shadow-2xl flex w-full relative flex-col justify-center  items-center space-x-4 pl-4  ">
            <img
              src={currentSong.coverImage}
              alt={currentSong.title}
              className="w-44 h-44 rounded-lg shadow-xl object-cover"
            />
            <button
              className="text-gray-100 space-x-1 bg-cyan-500 flex items-center justify-center rounded-3xl px-2  md:px-4 py-1"
              onClick={togglePlaylist}
            >
              <FaChevronCircleUp className="w-3 h-3" />
              <h1 className="text-xs md:text-sm">{t("queue")}</h1>
            </button>
            <CiSettings
              onClick={() => setShowSetting(!showsetting)}
              className="absolute left-0 top-1 w-8 h-8 text-cyan-500"
            />
            <div className="absolute left-0 top-10">
              {showsetting && (
                <MusicSidebar song={currentSong} show={showsetting} />
              )}
            </div>

            <div className="flex flex-col text-left">
              <h2 className="text-xl font-semibold">{currentSong.title}</h2>
              <p className="text-sm text-center text-gray-300 ">
                {Array.isArray(currentSong.artist)
                  ? currentSong.artist.map((a) => a.fullName).join(", ")
                  : currentSong.artist?.fullName || currentSong.artist}
              </p>
            </div>
          </div>
        )}

        <div
          className={`w-full   flex items-center 
          ${
            isExpanded
              ? "flex-col ml-0 justify-center "
              : "  justify-between ml-[20%] md:ml-[10%] xl:ml-[20%] lg:ml-[15%]"
          } 
          md:px-8 md:py-4 rounded-lg shadow-md`}
        >
          {/* Controls (Previous, Play/Pause, Next) */}
          <div className="flex justify-center items-center md:space-x-4">
            <button
              className="prev-btn text-gray-100 p-2 "
              onClick={handlePrev}
            >
              <FaStepBackward size={24} />
            </button>
            <button
              className="play-btn text-gray-100 p-2 "
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <IoPauseCircleOutline className="w-10 h-10" />
              ) : (
                <GoPlay className="w-10 h-10" />
              )}
            </button>
            <button className="next-btn text-gray-100 p-2" onClick={handleNext}>
              <FaStepForward size={24} />
            </button>
          </div>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
          />
          {/* Progress Bar */}
          <div
            className={` flex-grow flex items-center md:mx-4 ${
              isExpanded ? "w-full translate-x-0" : "translate-x-4"
            } md:translate-x-0`}
          >
            <div className=" flex justify-between items-center w-full md:px-4">
              <span className="text-xs text-gray-100">
                {formatDuration(currentTime)}
              </span>
              <input
                type="range"
                value={progress}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchEnd={handleSeekMouseUp}
                className="w-full h-1 bg-transparent  rounded-lg cursor-pointer"
                style={{ accentColor: "#1ecbe1" }}
              />
              <span className="text-xs text-gray-100">
                {isNaN(duration) ? "0:00" : formatDuration(duration)}
              </span>
            </div>
          </div>
        </div>

        <div className=" relative hidden md:w-52 md:flex items-center justify-center">
          <FaVolumeUp
            className="text-white cursor-pointer w-5 h-5"
            onClick={toggleSlider}
          />

          <div className="absolute right-0 hidden md:flex">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className=" md:w-16  cursor-pointer -rotate-90 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/80 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[7px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
            />
          </div>
        </div>
        <div className="lg:flex  space-x-3 hidden ">
          <div className="rounded-full p-1 border ">
            <IoShuffleOutline className="w-5 h-5" />
          </div>
          <div className="rounded-full p-1 border">
            <IoIosRepeat className="w-5 h-5" />
          </div>
          <div className="relative">
            <button
              className="text-gray-100 space-x-1 border flex items-center justify-center rounded-3xl px-2  md:px-4 py-1"
              onClick={() => setOpenQuality(!openQuality)}
            >
              <FaChevronCircleUp className="w-3 h-3" />
              <h1 className="text-xs md:text-sm">{t("quality")}</h1>{" "}
            </button>
            {openQuality && (
              <div className="absolute bottom-7 mt-2 bg-gray-100 rounded-md shadow-lg p-2 w-32">
                <div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-400 rounded-md"
                    onClick={() => {
                      handelQualityClick("low");
                      setOpenQuality(false);
                    }}
                  >
                    Low
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-400 rounded-md"
                    onClick={() => {
                      handelQualityClick("high");
                      setOpenQuality(false);
                    }}
                  >
                    High
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              className="text-gray-100 space-x-1 bg-cyan-500 flex items-center justify-center rounded-3xl px-2  md:px-4 py-1"
              onClick={togglePlaylist}
            >
              <FaChevronCircleUp className="w-3 h-3" />
              <h1 className="text-xs md:text-sm">{t("queue")}</h1>
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div
        className={`fixed right-0 bottom-16 bg-gray-800 p-4 text-white shadow-xl transform transition-transform duration-300 no-scrollbar ${
          isPlaylistOpen ? "translate-x-0" : "translate-x-full"
        } w-80 h-3/4 z-50 overflow-y-auto rounded-lg`}
      >
        <div className=" sticky flex justify-between items-center mb-4">
          <h4 className="text-white text-lg font-semibold">{t("queue")}</h4>
          <button
            className="text-yellow-400"
            onClick={() => dispatch(clearQueue())}
          >
            Clear queue
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded-full"
            onClick={() => setIsPlaylistOpen(false)}
          >
            X
          </button>
        </div>

        <ul className="space-y-4 ">
          {playlist.map((song, index) => (
            <li
              onClick={() => handelQueueSongClick(song)}
              key={index}
              className={`flex relative  items-center hover:bg-cyan-500 justify-start gap-4 p-2 rounded-md cursor-pointer ${
                index === currentSongIndex
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800"
              }`}
            >
              <img
                src={song.coverImage}
                alt={song.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex  w-6/12 flex-col justify-start items-start">
                <div className="w-full text-start overflow-hidden">
                  {" "}
                  {/* Wrapping div */}
                  <h5 className="text-lg font-semibold whitespace-nowrap">
                    {song.title}
                  </h5>
                </div>
                <div className="w-full text-start overflow-hidden">
                  {" "}
                  {/* Wrapping div */}
                  <p className="text-sm whitespace-nowrap">
                    {Array.isArray(song.artist) ? (
                      song.artist.map((artistObj, index) => (
                        <span
                          key={index}
                          onClick={() => navigate(`/artist/${artistObj._id}`)} // Example click handler
                          className="cursor-pointer hover:underline"
                        >
                          {artistObj.fullName}
                          {index !== song.artist.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span>
                        {song.artist?.fullName ||
                          song.artist ||
                          "Unknown Artist"}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="absolute right-1">
                <p className="text-sm">{formateDuration(song.duration)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute ${
          isExpanded ? "top-6" : "bottom-0"
        } right-1 md:hidden bg-cyan-600 hover:bg-cyan-700 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg`}
      >
        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
      </button>
    </div>
  );
};

export default MusicPlayer;
