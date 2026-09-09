import { createSlice } from "@reduxjs/toolkit";
const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    data: [],
    loading: true,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addConnections: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeConnections: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { addConnections, removeConnections, setLoading, setError } =
  connectionSlice.actions;
export default connectionSlice.reducer;
