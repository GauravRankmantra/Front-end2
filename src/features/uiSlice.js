// uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    showLoginPopup: false,
    loginPopupSong: null,
  },
  reducers: {
    setShowLoginPopup: (state, action) => {
      state.showLoginPopup = action.payload;
    },
    setloginPopupSong: (state, action) => {
      state.loginPopupSong = action.payload;
    },
  },
});

export const { setShowLoginPopup,setloginPopupSong } = uiSlice.actions;
export default uiSlice.reducer;
