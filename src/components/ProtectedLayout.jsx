import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setLoading, setError } from "../utils/userSlice";
import { useEffect } from "react";
import Toast from "./Toast";
import Loader from "./Loader";

import { createSocketConnection } from "../utils/socket";
import MatchCelebration from "./MatchCelebration";
import { hideMatch, showMatch } from "../utils/matchSlice";

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userData, loading } = useSelector((store) => store.user);
  const match = useSelector((store) => store.match.data);

  useEffect(() => {
    const fetchUser = async () => {
      if (userData) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await axios.get(API_BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data.data));
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to load your session";
        dispatch(setError(message));
        if (error.response?.status === 401) navigate("/login");
      }
    };

    fetchUser();
  }, [dispatch, navigate, userData]);

  // Globally track online status when user is logged in
  useEffect(() => {
    if (userData) {
      const socket = createSocketConnection();
      socket.emit("goOnline");
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    const socket = createSocketConnection();
    const handleMatchCreated = (matchData) => dispatch(showMatch(matchData));
    socket.on("match-created", handleMatchCreated);

    return () => socket.off("match-created", handleMatchCreated);
  }, [dispatch, userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-200/30">
      <Navbar />
      <main className="grow flex flex-col pt-4 pb-6">
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <MatchCelebration match={match} onClose={() => dispatch(hideMatch())} />
    </div>
  );
};

export default ProtectedLayout;
