// uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showLoginPopup: false,
  },
  reducers: {
    setShowLoginPopup: (state, action) => {
      state.showLoginPopup = action.payload;
    },
  },
});

export const { setShowLoginPopup } = uiSlice.actions;
export default uiSlice.reducer;
