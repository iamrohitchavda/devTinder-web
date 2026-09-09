import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import toastReducer from "./toastSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    request: requestReducer,
    toast: toastReducer,
  },
});

//! wherever you subscribe to the store, make sure to in useSelector access state like state.user means the name of the reducer here is user not userReducer

export default appStore;
