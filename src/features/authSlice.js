// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Thunk to check user authentication
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}api/v1/auth`, {
        withCredentials: true,
      });

      const user = response?.data?.user || null;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("musicPlayerData");

        return null;
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("musicPlayerData");
      return rejectWithValue(
        error?.response?.data?.message || "Authentication failed"
      );
    }
  }
);

// Initial state based on localStorage
const storedUser = localStorage.getItem("user");
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: storedUser ? true : false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("user");
    },
    authSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Failed to authenticate";
      });
  },
});

export const { logout, authSuccess } = authSlice.actions;
export default authSlice.reducer;
