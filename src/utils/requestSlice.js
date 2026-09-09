import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    data: [],
    loading: true,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addRequests: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearRequests: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
    setRequests: (state, action) => {
      state.data = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  clearRequests,
  setRequests,
  addRequests,
  removeRequest,
  setLoading,
  setError,
} = requestSlice.actions;
export default requestSlice.reducer;
