import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import toastReducer from "./toastSlice";
import matchReducer from "./matchSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    toast: toastReducer,
    match: matchReducer,
  },
});

//! wherever you subscribe to the store, make sure to in useSelector access state like state.user means the name of the reducer here is user not userReducer

export default appStore;
