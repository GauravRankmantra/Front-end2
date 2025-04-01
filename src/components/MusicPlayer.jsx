import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import playIcon from "../assets/svg/play_icon.svg";
import { GoPlay } from "react-icons/go";
import { IoPauseCircleOutline } from "react-icons/io5";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronCircleUp } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import { IoIosRepeat } from "react-icons/io";
import formateDuration from "../utils/formatDuration";

import {
  playNextSong,
  playPrevSong,
  setIsPlaying,
  addSongToHistory,
  addSongToQueue,
  seek,
  clearQueue,
} from "../features/musicSlice";

const MusicSidebar = ({ song }) => {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className={` transition-all shadow-2xl py-2 pr-2  absolute z-10 rounded-e-2xl duration-300 flex bg-cyan-500 text-white items-center ${
        expand ? "max-w-max" : "w-20 lg:w-24 xl:w-2/12"
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
            <h1 className={`text-lg text-start max-w-[120px]  font-semibold text-ellipsis overflow-hidden whitespace-nowrap
              ${ expand && "max-w-max"}
              `}>
              {song.title}
            </h1>
            {/* Song Artist */}
            <h2 className="text-sm text-start max-w-[120px] text-ellipsis overflow-hidden whitespace-nowrap">
              {song.artist}
            </h2>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div
          className={`flex-grow overflow-scroll no-scrollbar hidden md:hidden lg:flex  justify-around items-center ml-10 space-x-6 transition-opacity duration-300 ${
            expand ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <button className="flex items-center space-x-2 text-sm">
            <IoCloudDownloadOutline className="w-5 h-5" />
            <span className="text-lg">Download</span>
          </button>

          <button className="flex items-center space-x-2 text-sm border-l border-gray-100 pl-4">
            <CiHeart className="w-5 h-5" />
            <span className="text-lg">Favorite</span>
          </button>

          <button className="flex items-center space-x-2 text-sm border-l border-gray-100 pl-4">
            <MdOutlinePlaylistAdd className="w-5 h-5" />
            <span className="text-lg">Add to Playlist</span>
          </button>

          <button className="flex items-center space-x-2 text-sm border-l border-gray-100 pl-4">
            <IoCloudDownloadOutline className="w-5 h-5" />
            <span className="text-lg">Share</span>
          </button>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpand(!expand)}
          className={`absolute px-1 right-0 hidden md:hidden lg:flex  w-7 h-7 bg-cyan-500 rounded-full  justify-center items-center ${expand&& "translate-x-7"}`}
        >
          {expand ? (
            <MdOutlineExpandCircleDown className="  rotate-90 w-7 h-7" />
          ) : (
            <MdOutlineExpandCircleDown className="-rotate-90 w-7 h-7" />
          )}
        </button>
      </div>
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
  const handelQueueSongClick=(song)=>{
    dispatch(addSongToHistory(song));
    dispatch(addSongToQueue(song));

    dispatch(setIsPlaying(true));
  }

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
      if (audioRef.current.src !== currentSong.audioUrls.high) {
        audioRef.current.src = currentSong.audioUrls.high;
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
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center text-white z-50 text-center">
        <p className="text-white text-center font-bold">
          No song is currently playing
        </p>
      </div>
    );
  }

  return (

    <div
      className="fixed bottom-0 mb-0 left-0 w-full bg-gray-600 py-4 md:py-0 flex justify-between items-center text-white z-50 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${currentSong.coverImage})`, // Add linear gradient for black overlay
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative flex w-full items-center md:pr-16 pr-10">
        <MusicSidebar song={currentSong} />

        <div className="w-full flex justify-between  items-center ml-[20%] md:ml-[10%] xl:ml-[20%] lg:ml-[15%]  md:px-8 md:py-4 rounded-lg shadow-md">
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
          <div className=" flex-grow flex translate-x-4 md:translate-x-0 items-center md:mx-4">
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

        <div className="relative hidden md:w-52 md:flex items-center justify-center">
          <FaVolumeUp
            className="text-white cursor-pointer w-5 h-5"
            onClick={toggleSlider}
          />

          <div className="hidden md:flex">
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
        <div className="lg:flex space-x-3 hidden ">
          <div className="rounded-full p-1 border ">
            <IoShuffleOutline className="w-5 h-5" />
          </div>
          <div className="rounded-full p-1 border">
            <IoIosRepeat className="w-5 h-5" />
          </div>
          <div>
            <button
              className="text-gray-100 space-x-1 border flex items-center justify-center rounded-3xl px-2  md:px-4 py-1"
              onClick={togglePlaylist}
            >
              <FaChevronCircleUp className="w-3 h-3" />
              <h1 className="text-xs md:text-sm">Quality</h1>{" "}
            </button>
          </div>
          <div>
            <button
              className="text-gray-100 space-x-1 bg-cyan-500 flex items-center justify-center rounded-3xl px-2  md:px-4 py-1"
              onClick={togglePlaylist}
            >
              <FaChevronCircleUp className="w-3 h-3" />
              <h1 className="text-xs md:text-sm">Queue</h1>{" "}
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
          <h4 className="text-white text-lg font-semibold">Queue</h4>
          <button
            className="text-yellow-400"
            onClick={() => dispatch(clearQueue())}
          >
            Clear queue
          </button>
        </div>

        <ul className="space-y-4 ">
          {playlist.map((song, index) => (
            <li
            onClick={()=>handelQueueSongClick(song)}
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
                  <p className="text-sm whitespace-nowrap">{song.artist}</p>
                </div>
              </div>

              <div className="absolute right-1">
                <p className="text-sm">{formateDuration(song.duration)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;
