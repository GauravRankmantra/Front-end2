import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchQuery: "", // Default search query state
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = ""; // Clears the search query
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
