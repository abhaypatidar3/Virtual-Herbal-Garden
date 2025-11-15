// src/store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Register reducers
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      // keep previous user cleared
      state.user = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || action.payload;
      localStorage.setItem("loginuser", JSON.stringify(state.user));
    },
    registerFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Login reducers
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || action.payload;
      localStorage.setItem("loginuser", JSON.stringify(state.user));
    },
    loginFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    // Fetch user (me)
    fetchUserRequest(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user || action.payload;
    },
    fetchUserFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
    },

    // Logout
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("loginuser");
      localStorage.removeItem("token");
    },
    logoutFailed(state) {
      state.loading = false;
    },

    // Clear errors / reset loading
    clearAllErrors(state) {
      state.loading = false;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailed,
  loginRequest,
  loginSuccess,
  loginFailed,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailed,
  logoutSuccess,
  logoutFailed,
  clearAllErrors,
} = userSlice.actions;

// -------------------- THUNKS --------------------

// Register (JSON, no file)
export const register = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await axios.post("/api/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    });

    // backend may return { success, message, user, token } or similar
    const payload = res.data;
    dispatch(registerSuccess(payload));
    toast.success(payload.message || "Registered successfully");
    dispatch(clearAllErrors());
  } catch (err) {
    dispatch(registerFailed());
    toast.error(err?.response?.data?.message || err.message || "Registration failed");
    dispatch(clearAllErrors());
  }
};

// Login (JSON)
export const login = (data) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const res = await axios.post("/api/auth/login", data, {
      headers: { "Content-Type": "application/json" },
    });

    const payload = res.data;
    dispatch(loginSuccess(payload));
    toast.success(payload.message || "Logged in");
    dispatch(clearAllErrors());
  } catch (err) {
    dispatch(loginFailed());
    toast.error(err?.response?.data?.message || err.message || "Login failed");
    dispatch(clearAllErrors());
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    const res = await axios.post("/api/auth/logout", {}, { withCredentials: true });
    dispatch(logoutSuccess());
    toast.success(res.data.message || "Logged out");
  } catch (err) {
    dispatch(logoutFailed());
    toast.error("Logout failed");
  }
};


// Fetch current user (/me)
export const fetchUser = () => async (dispatch) => {
  dispatch(fetchUserRequest()); // optional
  try {
    const res = await axios.get("/api/auth/me"); // cookie sent automatically
    // expected: { success: true, user: {...} }
    const payload = res.data;
    dispatch(fetchUserSuccess(payload.user || payload));
  } catch (err) {
    dispatch(fetchUserFailed());
    // don't show a toast here — this is normal when user is not logged in
  }
};

export default userSlice.reducer;
