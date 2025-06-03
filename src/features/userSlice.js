import { createSlice } from "@reduxjs/toolkit";

// Check if there's a user saved in localStorage

let savedUser = null;
try {
  const raw = localStorage.getItem("user");
  savedUser = raw ? JSON.parse(raw) : null;
} catch (e) {
  localStorage.removeItem("user"); // Clean corrupted entry
  savedUser = null;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("musicPlayerData");
    },
    updateUser: (state, action) => {
      if (!state.user) return;

      const updates = action.payload;

      if (updates.purchasedSongs) {
        const existing = state.user.purchasedSongs || [];
        const newSongs = Array.isArray(updates.purchasedSongs)
          ? updates.purchasedSongs
          : [updates.purchasedSongs];

        state.user.purchasedSongs = Array.from(
          new Set([...existing, ...newSongs])
        );
        delete updates.purchasedSongs;
      }

      if (updates.likedSongs) {
        const existing = state.user.likedSongs || [];
        const newSongs = Array.isArray(updates.likedSongs)
          ? updates.likedSongs
          : [updates.likedSongs];

        state.user.likedSongs = Array.from(new Set([...existing, ...newSongs]));
        delete updates.likedSongs;
      }

      // ✅ Merge other updates
      state.user = {
        ...state.user,
        ...updates,
      };

      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUser, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
