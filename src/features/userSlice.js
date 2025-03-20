import { createSlice } from "@reduxjs/toolkit";

// Check if there's a user saved in localStorage
const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser, // Load the saved user from localStorage on initialization
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Save the user to localStorage whenever it's set
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      // Clear the user from localStorage on logout
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
