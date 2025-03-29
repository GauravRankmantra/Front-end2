import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Helper function to get initial state from localStorage
const getInitialMusicState = () => {
  try {
    const storedData = localStorage.getItem("musicPlayerData");
    if (storedData) {
      return JSON.parse(storedData);
    }
    return {
      currentSong: null,
      playlist: [],
      isPlaying: false,
      currentSongIndex: 0,
      recentlyPlayed: [],
    };
  } catch (error) {
    console.error(
      "Error retrieving music player data from localStorage:",
      error
    );
    return {
      currentSong: null,
      playlist: [],
      isPlaying: false,
      currentSongIndex: 0,
      recentlyPlayed: [],
    };
  }
};

const initialState = getInitialMusicState();
initialState.isPlaying = false;

const musicSlice = createSlice({
  name: "musicPlayer",
  initialState,
  reducers: {
    // Adding a song to the queue
    addSongToQueue: (state, action) => {
      const song = action.payload;

      // Set the artist to fullName if available, else use artist
      const artist = song.artist?.fullName ? song.artist.fullName : song.artist;

      // Store necessary fields, including low and high audioUrls and artist
      const sanitizedSong = {
        _id: song._id,
        title: song.title,
        coverImage: song.coverImage,
        artist: artist,
        duration: song.duration,
        audioUrls: {
          low: song.audioUrls.low,
          high: song.audioUrls.high,
        },
      };

      state.currentSong = sanitizedSong;
      if (state.playlist.length === 0) state.currentSongIndex = 0;
      else state.currentSongIndex = state.playlist.length;

      state.playlist.push(sanitizedSong);
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },

    addPlaylistToQueue: (state, action) => {
      const songs = action.payload;

      // Sanitize the songs to extract necessary fields, including low and high audioUrls and artist
      const sanitizedSongs = songs.map((song) => {
        const artist = song.artist?.fullName
          ? song.artist.fullName
          : song.artist;

        return {
          _id: song._id,
          title: song.title,
          coverImage: song.coverImage,
          artist: artist,
          duration: song.duration,
          audioUrls: {
            low: song.audioUrls.low,
            high: song.audioUrls.high,
          },
        };
      });

      if (state.playlist.length === 0 && sanitizedSongs.length > 0) {
        state.currentSong = sanitizedSongs[0];
        state.currentSongIndex = 0;
      }

      state.playlist = [...state.playlist, ...sanitizedSongs];
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },
    addRecentlyPlayed: (state, action) => {
      const song = action.payload;

      const songExists = state.recentlyPlayed.find(
        (item) => item._id === song._id
      );
      if (!songExists) {
        state.recentlyPlayed.push(song);

        if (state.recentlyPlayed.length > 10) {
          state.recentlyPlayed.shift();
        }

        localStorage.setItem("musicPlayerData", JSON.stringify(state));
      }
    },
    playNextSong: (state) => {
      if (state.currentSongIndex < state.playlist.length - 1) {
        state.currentSongIndex += 1;
        state.currentSong = state.playlist[state.currentSongIndex];
      }
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },

    playPrevSong: (state) => {
      if (state.currentSongIndex > 0) {
        state.currentSongIndex -= 1;
        state.currentSong = state.playlist[state.currentSongIndex];
      }
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },

    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },

    clearQueue: (state) => {
      state.playlist = [];
      state.currentSong = null;
      state.isPlaying = false;
      state.currentSongIndex = 0;
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },

    seek: (state, action) => {
      if (state.currentSong) {
        state.currentSong.currentTime = action.payload; // Assuming currentTime will be set in the audio player
      }
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },
  },
});

export const addSongToHistory = (song) => async (dispatch) => {
  try {
    const songId = song._id;
    await axios.post(
      `${apiUrl}api/v1/user/addHistory`, 
      { songId },
      { withCredentials: true }
    );

    dispatch(addRecentlyPlayed(song));
  } catch (error) {
    console.error("Failed to add song to history:", error);
  }
};

export const {
  addSongToQueue,
  addPlaylistToQueue,
  playNextSong,
  playPrevSong,
  setIsPlaying,
  clearQueue,
  seek,
  addRecentlyPlayed,
} = musicSlice.actions;

export default musicSlice.reducer;
