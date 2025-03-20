// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice.js';

// Configure the store and add your reducers
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
