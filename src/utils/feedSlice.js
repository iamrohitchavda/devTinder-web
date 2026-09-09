import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    data: [],
    loading: true,
    error: null,
  },
  reducers: {
    addFeed: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeFeed: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addFeed, removeFeed, setLoading, setError } = feedSlice.actions;
export default feedSlice.reducer;
