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

import play from "../assets/svg/play.svg";
import next from "../assets/svg/next.svg";
import prev from "../assets/svg/prev.svg";
import pause from "../assets/svg/pause.svg";

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
import MusicSidebar from "./MusicSidebar";

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
      className={`fixed font-josefin-r bottom-0 left-0 w-full z-50 text-white text-center transition-all duration-300 ${
        isExpanded ? "h-max py-5  " : " py-0 h-20  "
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${currentSong.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`relative  flex  h-[100%]  w-full items-center ${
          isExpanded
            ? "flex-col  pl-5 pr-5 md:pr-16"
            : "flex-row pl-0 pr-10 md:pr-16"
        }`}
      >
        {!isExpanded && <MusicSidebar song={currentSong} />}

{/* Mobile expand */}
        {isExpanded && (
          <div className="border border-gray-500/30 shadow-2xl flex w-full relative flex-col justify-center  items-center space-y-4">
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
              className="absolute -left-6 -top-5 w-6 h-6 text-cyan-500"
            />
            <div className="absolute left-0 top-10">
              {showsetting && (
                <div className="relative w-[100%]">
                  <MusicSidebar song={currentSong} show={showsetting} />
                </div>
              )}
            </div>

            <div className="flex flex-col ">
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
          className={`w-full    flex items-center 
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
             <img src={prev} className=" w-5 h-5"></img>
            </button>
            <button
              className="play-btn text-gray-100 p-2 "
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <img src={pause} className=" w-8 h-8"></img>
              ) : (
                <img src={play} className=" w-8 h-8"></img>
              )}
            </button>
            <button className="next-btn text-gray-100 p-2" onClick={handleNext}>
               <img src={next} className=" w-5 h-5"></img>
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
        className={`absolute  ${
          isExpanded ? "top-5" : "bottom-0"
        } right-1 md:hidden  text-cyan-500 rounded-full w-5 h-5 flex items-center justify-center shadow-lg`}
      >
        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
      </button>
    </div>
  );
};

export default MusicPlayer;
