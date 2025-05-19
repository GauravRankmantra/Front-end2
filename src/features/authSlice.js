// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  try {
    const response = await axios.get(`${apiUrl}api/v1/auth`, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
        authSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout,authSuccess} = authSlice.actions;
export default authSlice.reducer;
