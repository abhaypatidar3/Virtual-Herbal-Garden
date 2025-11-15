// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import "@/styles/SignUp.css"; // optional: keep if you have custom css. Tailwind does the heavy lifting.
import { register, login } from "@/store/slices/userSlice.js";
// import Back from "@/components/Back";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user || {});
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) navigateTo("/");
  }, [isAuthenticated, navigateTo]);

  const handleRegister = (e) => {
  e.preventDefault();

  const data = {
    username,
    email,
    password
  };

  dispatch(register(data));
  };



  const handleLogin = (e) => {
  e.preventDefault();

  const data = {
    email,
    password
  };

  dispatch(login(data));
};



  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 pt-[5vh] bg-cover bg-center bg-[url('src/assets/Ayush1.jpg')]"
    >
      <div className="w-full max-w-lg mx-auto">
        {/* Card */}
        <div className="bg-[#E1EEBC] rounded-[40px] shadow-xl p-8 sm:p-10 mx-4">
          <h1 className="text-3xl font-itim text-center text-[#123]">Welcome</h1>
          <p className="text-center text-gray-700 mt-1 text-sm">
            Log in to Virtual Herbal Garden
          </p>

          {/* Toggle */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => setMode("login")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                mode === "login"
                  ? "bg-[#0c8a66] text-white shadow"
                  : "bg-transparent text-[#0c8a66] border border-transparent hover:underline"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                mode === "signup"
                  ? "bg-[#0c8a66] text-white shadow"
                  : "bg-transparent text-[#0c8a66] border border-transparent hover:underline"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form area */}
          <div className="mt-6">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-sm text-[#0c6b58] font-medium text-left">
                  Email address*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0c8a66]"
                  placeholder="you@example.com"
                  required
                />

                <label className="block text-sm text-[#0c6b58] font-medium text-left">
                  Password*
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0c8a66]"
                  placeholder="Your password"
                  required
                />

                <div className="flex justify-end">
                  <a href="#0" className="text-sm text-blue-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#0c8a66] text-white py-3 rounded-md text-lg shadow"
                >
                  {loading ? "Logging in..." : "Continue"}
                </button>

                <p className="text-center text-sm text-gray-700 mt-3">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-blue-700 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left">
                    Full name*
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0c8a66]"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left">
                    Email address*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0c8a66]"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#0c6b58] font-medium text-left">
                    Password*
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0c8a66]"
                    placeholder="Your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#0c8a66] text-white py-3 rounded-md text-lg shadow"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 border rounded-md bg-[#E8F4C8]">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="flex-1 text-left">Continue with Google</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 border rounded-md bg-[#E8F4C8]">
              <img
                src="https://p7.hiclipart.com/preview/31/119/666/github-logo-repository-computer-icons-github.jpg"
                alt=""
                className="w-5 h-5"
              />
              <span className="flex-1 text-left">Continue with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
