import { useEffect } from "react";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addConnections,
  setError,
  setLoading,
} from "../../utils/connectionSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

const Connections = () => {
  const dispatch = useDispatch();
  const {
    data: connections,
    loading,
    error,
  } = useSelector((state) => state.connection);

  useEffect(() => {
    const fetchConnections = async () => {
      if (connections.length > 0) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await axios.get(API_BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        dispatch(addConnections(res.data.data));
      } catch (error) {
        dispatch(
          setError(
            error.response?.data?.message || "Unable to load connections",
          ),
        );
      }
    };

    fetchConnections();
  }, [connections.length, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (!connections) {
    return null;
  }

  if (error) {
    return <p className="text-center text-error my-10">{error}</p>;
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 animate-fade-in px-4 text-center">
        <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-base-content/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h1 className="font-extrabold text-3xl mb-2 text-base-content">
          No Connections Yet
        </h1>
        <p className="text-base-content/60">
          Start exploring the feed and making connections!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-base-content tracking-tight">
          Your Connections
        </h1>
        <p className="text-base-content/60 mt-2">
          Developers you've matched with.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection, index) => {
          const { firstName, lastName, bio, skills, age, gender, photoUrl } =
            connection;

          return (
            <div
              key={connection._id}
              className={`modern-card flex flex-col p-6 hover:-translate-y-1 transition-transform animate-slide-up bg-base-100 shadow-xl`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 bg-base-200">
                  <img
                    src={
                      photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-sm text-base-content/60 capitalize mt-0.5">
                    {age ? `${age} yrs` : ""} {gender ? `• ${gender}` : ""}
                  </p>
                </div>
              </div>

              {bio && (
                <p className="text-sm text-base-content/80 line-clamp-3 mb-4 grow relative">
                  <span className="absolute -left-1 -top-1 text-2xl text-primary/20 font-serif leading-none">
                    "
                  </span>
                  <span className="pl-4 italic">{bio}</span>
                </p>
              )}

              {skills && skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-base-200/50">
                  {skills.slice(0, 3).map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-2 py-1 bg-base-200 text-base-content rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className="text-xs font-medium px-2 py-1 bg-base-200/50 text-base-content/60 rounded-md">
                      +{skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <Link
                to={`/chat/${connection._id}`}
                state={{ receiverName: `${firstName} ${lastName}` }}
              >
                <button className="btn btn-outline btn-sm w-full mt-4 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors">
                  Send Message
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
