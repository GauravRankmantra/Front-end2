import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaList,
  FaVolumeUp,
} from "react-icons/fa"; // Import icons
import {
  playNextSong,
  playPrevSong,
  setIsPlaying,
  seek,
} from "../features/musicSlice"; // Import the needed actions

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null); // Reference to the audio element
  const [progress, setProgress] = useState(0); // State for the progress bar
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); // State for playlist visibility
  const [volume, setVolume] = useState(50); // State for volume control
  const [showSlider, setShowSlider] = useState(false);

  const { currentSong, playlist, isPlaying, currentSongIndex } = useSelector(
    (state) => ({
      currentSong: state.musicPlayer?.currentSong || null,
      playlist: state.musicPlayer?.playlist || [],
      isPlaying: state.musicPlayer?.isPlaying || false,
      currentSongIndex: state.musicPlayer?.currentSongIndex || 0,
    })
  );
  const toggleSlider = () => {
    setShowSlider(!showSlider);
  };

  // Play or pause the audio element when the isPlaying state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100; // Set initial volume
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audioUrls.high;
      audioRef.current.play();
      dispatch(setIsPlaying(true));
    }
  }, [currentSong, dispatch]);

  // Update progress as the song plays
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  // Handle seeking when user drags the seek bar
  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    dispatch(seek(newTime));
  };

  // Handle next song action
  const handleNext = () => {
    dispatch(playNextSong());
  };

  // Handle previous song action
  const handlePrev = () => {
    dispatch(playPrevSong());
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  // Toggle playlist visibility
  const togglePlaylist = () => {
    setIsPlaylistOpen(!isPlaylistOpen);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center text-white z-50 text-center">
        <p className="text-white text-center font-bold">No song is currently playing</p>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-gray-600 px-4 py-2 flex justify-between items-center text-white z-50 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${currentSong.coverImage})`, // Add linear gradient for black overlay
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full md:pr-16 pr-10">
        <div className="flex w-[15%] justify-center items-center">
          <div className="w-24 md:block hidden">
            <img className="object-cover" src={currentSong.coverImage} alt="" />
          </div>
          <div className="flex flex-col content-start justify-items-start justify-start items-start ">
            <h3 className="text-white text-sm md:text-xl font-semibold ">
              {currentSong.title}
            </h3>
            <p className="text-gray-400 md:text-sm text-xs">
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="w-full ">
          <div className="flex justify-center items-center mb-4 w-3/5 mx-auto">
            <button
              className="prev-btn text-gray-100 px-4 py-2"
              onClick={handlePrev}
            >
              <FaStepBackward size={24} />
            </button>
            <button
              className="play-btn text-gray-100 px-4 py-2"
              onClick={handlePlayPause}
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button
              className="next-btn text-gray-100 px-4 py-2"
              onClick={handleNext}
            >
              <FaStepForward size={24} />
            </button>
          </div>

          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
          />

          {/* Progress Bar */}
          <div className="progress-bar w-3/5 mx-auto mt-4">
            <input
              type="range"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

    
        <div className="relative w-24 md:w-52 flex items-center justify-center">
      <FaVolumeUp className="text-white cursor-pointer" size={24} onClick={toggleSlider} />
      {showSlider && (
        <div className="absolute -right-10 mt-8 h-24 md:hidden">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-24 bg-transparent cursor-pointer -rotate-90"
          />
        </div>
      )}
      <div className="hidden md:block">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="md:w-24 md:h-2 w-16 h-1 bg-transparent cursor-pointer"
        />
      </div>
    </div>
      </div>

      {/* Playlist Toggle Button */}
      <div className="absolute md:right-0 -right-3">
        <button className="text-gray-100 px-4 py-2" onClick={togglePlaylist}>
          <FaList size={24} />
        </button>
      </div>

      {/* Playlist Sidebar */}
      <div
        className={`fixed right-0 bottom-16 bg-gray-900 p-4 text-white shadow-xl transform transition-transform duration-300 ${
          isPlaylistOpen ? "translate-x-0" : "translate-x-full"
        } w-80 h-3/4 z-50 overflow-y-auto rounded-lg`}
      >
        <div className=" sticky flex justify-between items-center mb-4">
          <h4 className="text-white text-lg font-semibold">Queue</h4>
          <button className="text-yellow-400" onClick={togglePlaylist}>
            Close
          </button>
        </div>

        <ul className="space-y-4">
          {playlist.map((song, index) => (
            <li
              key={index}
              className={`flex items-center justify-start gap-4 p-2 rounded-md cursor-pointer ${
                index === currentSongIndex
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-700"
              }`}
            >
              <img
                src={song.coverImage}
                alt={song.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex flex-col justify-start items-start">
                <h5 className="text-lg font-semibold">{song.title}</h5>
                <p className="text-sm">{song.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;


