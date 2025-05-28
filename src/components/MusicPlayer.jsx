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
import getArtistNames from "../utils/getArtistNames";
import { PiDownloadDuotone } from "react-icons/pi";
import { TbCloudDownload } from "react-icons/tb";

import { RiArrowDownDoubleLine } from "react-icons/ri";
import { VscClose } from "react-icons/vsc";

import "../index.css";
import { FaVolumeUp } from "react-icons/fa"; // Import icons

import play from "../assets/svg/play.svg";
import next from "../assets/svg/next.svg";
import prev from "../assets/svg/prev.svg";
import pause from "../assets/svg/pause.svg";
import useIsMobile from "../utils/useIsMobile";

import { FaChevronCircleUp } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import { IoIosRepeat } from "react-icons/io";

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
import { Download, Repeat, ShoppingCart } from "lucide-react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

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
  const [animate, setAnimate] = useState(false);
  const [collaps, setCollaps] = useState(false);
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const user = useSelector((state) => state.user.user);

  const isShuffle = useSelector((state) => state.musicPlayer.isShuffle);
  const isRepeating = useSelector((state) => state.musicPlayer.isRepeating);
  const navigate = useNavigate();

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

  const handleDownload = async () => {
    const songId = currentSong._id;
    let artistIds = [];

    console.log("songs at bottom ", currentSong);
    if (typeof currentSong.artist === "string") {
      artistIds.push(currentSong.artist._id);
    } else if (Array.isArray(currentSong.artist)) {
      artistIds = currentSong.artist
        .filter((artist) => artist && artist._id)
        .map((artist) => artist._id);
    } else {
      console.warn(
        "song.artist is not a string or an array:",
        currentSong.artist
      );
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
        const audioResponse = await axios.get(currentSong.audioUrls.high, {
          responseType: "blob",
        });

        const audioBlob = audioResponse.data;
        const downloadLink = document.createElement("a");
        const url = window.URL.createObjectURL(audioBlob);
        downloadLink.href = url;
        downloadLink.download = `${currentSong.title}.mp3`;
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

  const toggleSlider = (e) => {
    e.stopPropagation();
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

  const handleNext = (e) => {
    e?.stopPropagation?.();

    if (isRepeating) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.error("Repeat error:", err));
      }
    } else {
      dispatch(playNextSong());
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    dispatch(playPrevSong());
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Play error:", err));
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  const togglePlaylist = (e) => {
    e.stopPropagation();
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
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
      onClick={() => {
        if (isMobile) setIsExpanded(true);
      }}
      className={`fixed  font-josefin-r  bottom-0 left-0 w-full z-50 text-white text-center transition-all duration-300 ease-in-out ${
        isExpanded ? `h-max pb-5  ` : ` pb-0 ${collaps ? `h-0` : `h-[4.5rem]`}`
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${currentSong.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`${isExpanded ? `hidden` : `hidden md:flex`} w-full ${
          collaps && `md:hidden`
        }  `}
      >
        <MusicSidebar song={currentSong} />
      </div>
      <div
        className={`relative   flex ${
          collaps ? `` : `h-[100%]`
        }   w-full items-center ${
          isExpanded
            ? "flex-col  pl-5 pr-5 md:pr-16"
            : "flex-row pl-0 pr-0 md:pr-16"
        }`}
      >
        <div className={` hidden lg:flex absolute ${collaps?`-top-8`:`-top-4`}  right-2`}>
          <MdKeyboardDoubleArrowDown  className={`w-8 cursor-pointer h-8 text-cyan-500 ${collaps?`rotate-180`:`rotate-0`} transition-all duration-500 ease-in-out`} onClick={() => setCollaps(!collaps)} />
        </div>
        {/* mobile main */}
        <div
          className={` ${
            isExpanded ? `hidden` : `flex md:hidden`
          } justify-between  w-full items-center gap-1  shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-center gap-3 ">
            <img
              src={currentSong.coverImage}
              alt={currentSong.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div className="flex flex-col justify-start items-start max-w-[10px]">
              {/* Song Title */}
              <h1
                className="text-sm font-medium text-gray-100 truncate"
                title={currentSong.title}
              >
                {currentSong.title}
              </h1>

              {/* Artist(s) */}
              <p
                className="text-xs text-gray-300 truncate"
                title={getArtistNames(currentSong.artist)}
              >
                {getArtistNames(currentSong.artist)}
              </p>
            </div>
          </div>
          <div className="flex mx-2 space-x-1">
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

            <div className="md:hidde  flex flex-col justify-center items-center ">
              {user?.purchasedSongs?.includes(currentSong._id) ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDownloadClick();
                  }}
                  className=" p-1  "
                >
                  <TbCloudDownload className="w-7 h-7  text-cyan-500" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(
                      `/purchased?id=${encodeURIComponent(currentSong._id)}`
                    );
                  }}
                  className=" p-1  "
                >
                  <ShoppingCart className="w-7 h-7 text-green-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile expand */}
        {isExpanded && (
          <div className=" border-gray-500/20 shadow-2xl flex w-full relative flex-col justify-center  items-center space-y-4">
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

            <div></div>
          </div>
        )}

        <div
          className={` ${
            isExpanded
              ? `flex border border-white/30 shadow-2xl rounded-xl pr-1`
              : `hidden md:flex`
          } md:ml-72 flex-row justify-center items-center  w-full`}
        >
          {/* Controls (Previous, Play/Pause, Next) */}
          <div className="flex  md:space-x-4">
            <button
              className={` prev-btn text-gray-100 p-2`}
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
            className={` flex-grow  w-[70%] flex items-center md:mx-4 

               
            translate-x-0`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className=" flex justify-between items-center w-full md:px-4"
            >
              <span className="text-xs text-gray-100">
                {formatDuration(currentTime)}
              </span>
              <input
                type="range"
                value={progress}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchEnd={handleSeekMouseUp}
                onPointerDown={(e) => e.stopPropagation()}
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
            className={`${
              isExpanded ? `hidden md:hidden` : `flex md:flex`
            }text-white cursor-pointer w-5 h-5`}
            onClick={toggleSlider}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className={`${
              isExpanded ? `hidden md:hidden` : `flex md:flex`
            } absolute right-0 hidden 
            `}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onPointerDown={(e) => e.stopPropagation()}
              onChange={handleVolumeChange}
              className=" md:w-16  cursor-pointer -rotate-90 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/80 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[7px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
            />
          </div>
        </div>
        <div className="lg:flex  space-x-3 hidden ">
          <div
            onClick={() => {
              dispatch(shufflePlaylist(playlist));
              setAnimate(true);
              setTimeout(() => {
                setAnimate(false);
              }, 800);
            }}
            className={`${
              animate && `animate-spin duration-700 repeat-1`
            } cursor-pointer rounded-full p-1 border `}
          >
            <IoShuffleOutline className="w-5 h-5" />
          </div>
          <div
            onClick={() => dispatch(toggleRepeat())}
            className={`${
              isRepeating ? `bg-cyan-500` : `bg-transparent`
            } rounded-full p-1 border cursor-pointer`}
          >
            <IoIosRepeat className="w-5 h-5" />
          </div>
          <div className="relative">
            <button
              className="text-gray-100 space-x-1 border flex items-center justify-center rounded-3xl px-2  md:px-4 py-1"
              onClick={(e) => {
                e.stopPropagation();
                setOpenQuality(!openQuality);
              }}
            >
              <FaChevronCircleUp className="w-3 h-3" />
              <h1 className="text-xs md:text-sm">{t("quality")}</h1>{" "}
            </button>
            {openQuality && (
              <div className="absolute bottom-7 mt-2 bg-gray-100 rounded-md shadow-lg p-2 w-32">
                <div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-400 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handelQualityClick("low");
                      setOpenQuality(false);
                    }}
                  >
                    Low
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-400 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
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
        className={`fixed right-0 bottom-0 bg-gray-800 p-4 text-white shadow-xl transform transition-transform duration-300 no-scrollbar ${
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
            className="bg-red-500 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaylistOpen(false);
            }}
          >
            <MdKeyboardDoubleArrowDown className="w-6 h-6 -rotate-90" />
          </button>
        </div>

        <ul className="space-y-4 ">
          {playlist.map((song, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                handelQueueSongClick(song);
              }}
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
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(`/artist/${artistObj._id}`);
                          }}
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
                <p className="text-sm">{song.duration}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* <div className="absolute space-y-2 md:hidden right-1 bottom-1/2 top-1/2 flex flex-col justify-center items-center ">
        {user?.purchasedSongs?.includes(currentSong._id) ? (
          <button onClick={() => handleDownloadClick()} className=" p-1  ">
            <Download className="w-6 h-6  text-green-600" />
          </button>
        ) : (
          <ShoppingCart className="w-5 h-5 text-cyan-600" />
        )}
      </div> */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={` absolute top-1 right-2 md:hidden  text-cyan-500/80 rounded-full w-8 h-8 flex items-center justify-center shadow-lg`}
      >
        {isExpanded ? (
          <RiArrowDownDoubleLine className="w-8 h-8 rotate-180 animate-bounce" />
        ) : (
          ""
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={` absolute left-2 top-1 w-8 h-8 md:hidden  text-cyan-500/80 rounded-full  flex items-center justify-center shadow-lg`}
      >
        {showsetting ? (
          <CiSettings className="w-8 h-8 rotate-180 animate-bounce" />
        ) : (
          ""
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
