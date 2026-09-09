import { io } from "socket.io-client";
import { API_BASE_URL } from "./constants";

let socketInstance = null;

export const createSocketConnection = () => {
  if (!socketInstance) {
    if (location.hostname === "localhost") {
      socketInstance = io(API_BASE_URL, { withCredentials: true });
    } else {
      socketInstance = io("/", {
        path: "/api/socket.io",
        withCredentials: true,
      });
    }
  } else {
    // If the socket was previously disconnected (e.g. after a manual logout),
    // forcefully reconnect it when they log back in!
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
  }
  return socketInstance;
};
