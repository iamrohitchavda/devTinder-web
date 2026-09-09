import axios from "axios";
import { addFeed, setError, setLoading } from "../../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { API_BASE_URL } from "../../utils/constants";
import UserCard from "../../components/UserCard";
import Loader from "../../components/Loader";

const Feed = () => {
  const { data: feed, loading, error } = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    const getFeed = async () => {
      if (feed.length > 0) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const response = await axios.get(API_BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(response.data.data));
      } catch (error) {
        dispatch(
          setError(error.response?.data?.message || "Unable to load the feed"),
        );
      }
    };

    getFeed();
  }, [dispatch, feed.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-error my-10">{error}</p>;
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
