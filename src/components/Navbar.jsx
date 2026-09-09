import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";
import { hideToast } from "../utils/toastSlice";
import { createSocketConnection } from "../utils/socket";

export const Navbar = () => {
  const { data: user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(API_BASE_URL + "/logout", {}, { withCredentials: true });

      const socket = createSocketConnection();
      socket.disconnect();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      dispatch(clearRequests());
      dispatch(hideToast());
      navigate("/login");
    }
  };

  return (
    <div className="navbar glass-nav sticky top-0 z-50 transition-all duration-300 px-2 sm:px-6 shadow-sm animate-fade-in text-base-content">
      <div className="flex-1">
        <Link
          to={user ? "/" : "/login"}
          className="btn btn-ghost text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform text-primary"
        >
          DevTinder
        </Link>
      </div>
      {user && (
        <div className="flex-none flex items-center gap-2">
          <h3 className="hidden md:block font-medium text-base-content/80 mr-4">
            Welcome,{" "}
            <span className="font-bold text-base-content">
              {user.firstName}
            </span>
          </h3>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform ring-2 ring-primary/20 hover:ring-primary/60"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={
                    user.photoUrl ||
                    "https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  className="object-cover"
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-lg rounded-2xl z-1 mt-4 w-52 p-3 shadow-2xl border border-base-200 gap-1"
            >
              <li className="md:hidden pb-2 mb-2 border-b border-base-200">
                <span className="font-semibold px-2">Hi, {user.firstName}</span>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="justify-between hover:bg-base-200 rounded-lg py-2 transition-colors"
                >
                  Profile
                  <span className="badge badge-primary badge-sm">New</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="hover:bg-base-200 rounded-lg py-2 transition-colors"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="hover:bg-base-200 rounded-lg py-2 transition-colors"
                >
                  Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/premium"
                  className="hover:bg-base-200 rounded-lg py-2 transition-colors text-warning font-semibold"
                >
                  Premium
                </Link>
              </li>
              <div className="divider my-0"></div>
              <li>
                <a
                  onClick={handleLogout}
                  className="hover:bg-error/10 hover:text-error rounded-lg py-2 transition-colors font-medium"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
