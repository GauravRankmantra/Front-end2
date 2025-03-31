import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const apiUrl = import.meta.env.VITE_API_URL;


// Fetch top 15 songs initially
export const fetchTopSongs = createAsyncThunk(
  "playlist/fetchTopSongs",
  async () => {
    const response = await axios.get(`${apiUrl}api/v1/song/top15`);
    return response.data.data;
  }
);

// Search songs
export const searchSongs = createAsyncThunk(
  "playlist/searchSongs",
  async (query) => {
    const response = await axios.get(`${apiUrl}api/v1/song/search`, {
      params: { query },
    });
    return response.data.data;
  }
);

// Create playlist
export const createPlaylist = createAsyncThunk(
  "playlist/create",
  async ({ name, songs, description, coverImage }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("songs", JSON.stringify(songs.map((song) => song._id)));
      if (coverImage) formData.append("coverImage", coverImage);
      const response = await axios.post(`${apiUrl}playlist`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 200 || 2001) {
        toast.success("Playlist Added ", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    name: "",
    description: "",
    coverImage: null,
    songs: [],
    availableSongs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPlaylistName: (state, action) => {
      state.name = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    addSong: (state, action) => {
      if (
        state.songs.length < 20 &&
        !state.songs.some((song) => song._id === action.payload._id)
      ) {
        state.songs.push(action.payload);
      }
    },
    removeSong: (state, action) => {
      state.songs = state.songs.filter((song) => song._id !== action.payload);
    },
    resetPlaylist: (state) => {
      state.name = "";
      state.coverImage =null;
      state.description = "";
      state.songs = [];
      state.availableSongs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSongs = action.payload;
      })
      .addCase(fetchTopSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchSongs.fulfilled, (state, action) => {
        state.availableSongs = action.payload;
      })
      .addCase(createPlaylist.fulfilled, (state) => {
        state.name = "";
        state.description = null;
        state.coverImage = null;
        state.songs = [];
        state.availableSongs = [];
      });
  },
});

export const {
  setPlaylistName,
  setDescription,
  addSong,
  removeSong,
  resetPlaylist,
} = playlistSlice.actions;
export default playlistSlice.reducer;
