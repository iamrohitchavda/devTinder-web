import { useState } from "react";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        API_BASE_URL + "/login",
        {
          email,
          password
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.message || "Login failed. Please try again.");
        setEmail("");
        setPassword("");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        API_BASE_URL + "/signup",
        {
          firstName,
          lastName,
          email,
          password
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data.message || "Sign up failed. Please try again.");
        setEmail("");
        setPassword("");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center grow items-center min-h-[75vh] px-4 py-10 animate-fade-in relative w-full">
      <div className="modern-card w-full max-w-md p-8 sm:p-10 shadow-2xl relative overflow-hidden bg-base-100/90 backdrop-blur-md">
        
        {/* Decorative background blurs */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col w-full gap-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-base-content tracking-tight">
              {isLoginForm ? "Welcome Back" : "Join DevTinder"}
            </h2>
            <p className="text-base-content/60 mt-2 text-sm">
              {isLoginForm ? "Sign in to connect with amazing developers." : "Create an account to start your journey."}
            </p>
          </div>

          {!isLoginForm && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col flex-1 gap-1">
                <label className="text-sm font-semibold text-base-content/80 ml-1">First Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary transition-all rounded-xl"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <label className="text-sm font-semibold text-base-content/80 ml-1">Last Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary transition-all rounded-xl"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-base-content/80 ml-1">Email</label>
            <input
              type="email"
              className="input input-bordered w-full focus:input-primary transition-all rounded-xl"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-base-content/80 ml-1">Password</label>
            <input
              type="password"
              className="input input-bordered w-full focus:input-primary transition-all rounded-xl"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-error/10 text-error text-sm p-3 rounded-xl border border-error/20 font-medium">
              {error}
            </div>
          )}
          
          <button
            className="btn btn-primary w-full mt-4 rounded-full shadow-lg hover:shadow-primary/30 transition-shadow font-bold text-base"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? "Sign In" : "Create Account"}
          </button>
          
          <div className="divider text-base-content/40 text-sm mt-4">OR</div>
          
          <p className="text-center text-sm mt-2 text-base-content/70">
            {isLoginForm ? (
              <>
                Don't have an account?{" "}
                <button
                  className="text-primary font-bold hover:underline cursor-pointer focus:outline-none transition-colors ml-1"
                  onClick={() => setIsLoginForm(false)}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-primary font-bold hover:underline cursor-pointer focus:outline-none transition-colors ml-1"
                  onClick={() => setIsLoginForm(true)}
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
