import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    show: false,
    message: "",
    type: "success", // 'success', 'error', 'info', 'warning'
  },
  reducers: {
    showToast: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    hideToast: (state) => {
      state.show = false;
      state.message = "";
      state.type = "success";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
