// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice.js";
import musicReducer from "./features/musicSlice.js";
import searchReducer from "./features/searchSlice.js";
import playlistReducer from "./features/playlistSlice.js";


// Configure the store and add your reducers
const store = configureStore({
  reducer: {
    user: userReducer,
    musicPlayer: musicReducer,
    search: searchReducer,
    playlist: playlistReducer,
  },
  
});

export default store;
