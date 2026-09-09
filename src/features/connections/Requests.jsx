import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../../utils/constants";
import {
  addRequests,
  removeRequest,
  setError,
  setLoading,
} from "../../utils/requestSlice";
import { useEffect } from "react";
import { showToast } from "../../utils/toastSlice";

const Requests = () => {
  const {
    data: request,
    loading,
    error,
  } = useSelector((state) => state.request);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRequests = async () => {
      if (request.length > 0) {
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));
      try {
        const res = await axios.get(API_BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });
        dispatch(addRequests(res.data.data));
      } catch (error) {
        dispatch(
          setError(error.response?.data?.message || "Unable to load requests"),
        );
      }
    };

    fetchRequests();
  }, [dispatch, request.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  if (error) {
    return <p className="text-center text-error my-10">{error}</p>;
  }

  if (request.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <h1 className="text-bold text-2xl">No Requests Found</h1>
      </div>
    );
  }

  const handleRequest = async (requestId, status) => {
    try {
      await axios.post(
        API_BASE_URL + `/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeRequest(requestId));
      dispatch(
        showToast({
          message:
            status === "accepted"
              ? "Request accepted successfully!"
              : "Request rejected.",
          type: status === "accepted" ? "success" : "error",
        }),
      );
    } catch (error) {
      dispatch(
        showToast({
          message: error.response?.data?.message || "Unable to update request",
          type: "error",
        }),
      );
    }
  };

  return (
    <div className="my-10">
      <h1 className="text-bold text-center text-white text-3xl mb-6">
        Connections Requests
      </h1>

      {request.map((request) => {
        const { firstName, lastName, bio, skills, age, gender, photoUrl } =
          request.fromUserId;

        return (
          <div
            key={request._id}
            className="card w-1/3 bg-black shadow-xl m-auto mb-6"
          >
            <div className="card-body shadow-2xl">
              <div className="flex items-center gap-4">
                {/* Avatar - Fixed width */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      photoUrl ||
                      "https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt={`${firstName} ${lastName}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>

                {/* Name and Bio - Fixed width, takes priority */}
                <div className="flex-shrink-0 w-64">
                  <h1 className="card-title text-lg">
                    {firstName} {lastName}
                  </h1>
                  {age && (
                    <p className="text-sm mt-1">
                      {age}, {gender}
                    </p>
                  )}
                  {bio && (
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {bio}
                    </p>
                  )}
                  {skills && (
                    <p className="text-sm break-words overflow-wrap-anywhere">
                      {skills?.length > 0 ? skills.join(", ") : "N/A"}
                    </p>
                  )}
                </div>

                <div className="flex-1 min-w-0 contents">
                  <button
                    className="btn btn-primary margin-inherit"
                    onClick={() => handleRequest(request._id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleRequest(request._id, "accepted")}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
