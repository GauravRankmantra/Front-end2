import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch search results
export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}api/v1/home/searchAll`, {
        params: { query },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching results"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.query = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
