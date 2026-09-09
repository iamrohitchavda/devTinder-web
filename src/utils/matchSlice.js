import { createSlice } from "@reduxjs/toolkit";

const matchSlice = createSlice({
  name: "match",
  initialState: { data: null },
  reducers: {
    showMatch: (state, action) => {
      state.data = action.payload;
    },
    hideMatch: (state) => {
      state.data = null;
    },
  },
});

export const { showMatch, hideMatch } = matchSlice.actions;
export default matchSlice.reducer;
