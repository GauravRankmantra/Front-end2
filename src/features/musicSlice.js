import { createSlice } from "@reduxjs/toolkit";

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
    };
  }
};

const initialState = getInitialMusicState();

const musicSlice = createSlice({
  name: "musicPlayer",
  initialState,
  reducers: {
    addSongToQueue: (state, action) => {
      state.currentSong = action.payload;
      if (state.playlist.length === 0) state.currentSongIndex = 0;
      else state.currentSongIndex = state.playlist.length;

      state.playlist.push(action.payload);
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
    },
    addPlaylistToQueue: (state, action) => {
      if (state.playlist.length === 0 && action.payload.length > 0) {
       
        state.currentSong = action.payload[0];
        state.currentSongIndex = 0;
      }
      state.playlist = [...state.playlist, ...action.payload];
      localStorage.setItem("musicPlayerData", JSON.stringify(state));
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

export const {
  addSongToQueue,
  addPlaylistToQueue,
  playNextSong,
  playPrevSong,
  setIsPlaying,
  clearQueue,
  seek,
} = musicSlice.actions;

export default musicSlice.reducer;
