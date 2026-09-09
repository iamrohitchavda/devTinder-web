import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";
import { API_BASE_URL } from "../utils/constants";
import { useState } from "react";
import { showMatch } from "../utils/matchSlice";

const UserCard = ({ user, compact = false, showActions = true }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, bio } = user || {};
  const dispatch = useDispatch();
  const [animationClass, setAnimationClass] = useState("animate-slide-up");
  const imageHeight = compact ? "h-64 sm:h-72" : "h-[360px] sm:h-[420px]";

  const handleSendRequest = async (status, userId) => {
    // trigger swipe animation
    if (status === "interested") {
      setAnimationClass("animate-swipe-right");
    } else {
      setAnimationClass("animate-swipe-left");
    }

    // wait for animation to complete before removing from feed
    setTimeout(async () => {
      try {
        const response = await axios.post(
          API_BASE_URL + `/swipes/${status}/${userId}`,
          {},
          { withCredentials: true },
        );
        if (response.data.data?.isMatch) {
          dispatch(showMatch(response.data.data));
        }
        dispatch(removeFeed(userId));
        // Reset animation for the next card that renders
        setAnimationClass("animate-slide-up");
      } catch (error) {
        setAnimationClass("animate-slide-up");
        console.error("Error sending connection request:", error);
      }
    }, 350);
  };

  return user ? (
    <div
      className={`modern-card w-full max-w-sm mx-auto sm:w-96 group relative ${animationClass}`}
    >
      <figure
        className={`relative ${imageHeight} w-full overflow-hidden bg-base-300`}
      >
        <img
          src={
            photoUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
          }
          alt="User profile"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Gradient overlay to make text readable */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white drop-shadow-md">
          <h2 className="text-3xl font-extrabold flex items-baseline gap-2 mb-1">
            {firstName} {lastName}
            {age && (
              <span className="text-2xl font-normal opacity-90">{age}</span>
            )}
          </h2>
          {gender && (
            <p className="opacity-90 capitalize font-medium text-lg tracking-wide">
              {gender}
            </p>
          )}
        </div>
      </figure>

      <div
        className={`${compact ? "p-4 gap-3" : "p-6 gap-4"} bg-base-100 flex flex-col relative z-10 border-t border-base-200/50`}
      >
        {bio ? (
          <p className="text-base-content/80 text-sm sm:text-base leading-relaxed overflow-y-auto max-h-24 pr-2">
            {bio}
          </p>
        ) : (
          <p className="text-base-content/40 italic">
            This user hasn't added a bio yet.
          </p>
        )}

        {showActions && (
          <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-base-200">
            <button
              className="btn btn-circle w-16 h-16 bg-base-100 border-2 border-error text-error hover:bg-error hover:text-white hover:scale-110 hover:border-error shadow-xl transition-all duration-300 ease-spring"
              onClick={() => handleSendRequest("ignored", _id)}
              aria-label="Ignore"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <button
              className="btn btn-circle w-16 h-16 bg-base-100 border-2 border-success text-success hover:bg-success hover:text-white hover:scale-110 hover:border-success shadow-xl transition-all duration-300 ease-spring"
              onClick={() => handleSendRequest("interested", _id)}
              aria-label="Interested"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in bg-base-100 rounded-3xl shadow-lg border border-base-200 max-w-sm mx-auto">
      <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
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
      <h3 className="text-2xl font-bold mb-3 text-base-content">
        No More Matches!
      </h3>
      <p className="text-base-content/60 max-w-xs">
        Check back later or expand your preferences to see more developers in
        your area.
      </p>
    </div>
  );
};

export default UserCard;
