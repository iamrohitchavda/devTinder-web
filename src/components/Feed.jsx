import axios from "axios";
import { addFeed, setLoading } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { API_BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import Loader from "./Loader";

const Feed = () => {
  const { data: feed, loading } = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed.length > 0) {
      dispatch(setLoading(false));
      return;
    }
    try {
      const response = await axios.get(API_BASE_URL + "/feed", {
        withCredentials: true
      });

      dispatch(addFeed(response.data.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    feed && (
      <div className="flex flex-col items-center justify-center w-full px-4 my-6 sm:my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
