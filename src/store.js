// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice.js';
import musicReducer from "./features/musicSlice.js" 

// Configure the store and add your reducers
const store = configureStore({
  reducer: {
    user: userReducer,
    musicPlayer:musicReducer
  },
});

export default store;
