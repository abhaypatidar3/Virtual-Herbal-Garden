// src/pages/MyProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { logout, fetchUser } from "@/store/slices/userSlice";
import { PlantContext } from "@/context/PlantContext";

const API_BASE = "http://localhost:3000";

// ✅ Configure axios instance with credentials
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { bookmark } = useContext(PlantContext);

  // Tabs
  const [activeTab, setActiveTab] = useState("profile");

  // Profile edit
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete account
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Stats
  const [stats, setStats] = useState(null);
  const [quizScores, setQuizScores] = useState({});

  // Loading states
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Load quiz scores from localStorage
  useEffect(() => {
    if (user) {
      const savedScores = localStorage.getItem(`quizScores_${user.username}`);
      if (savedScores) {
        setQuizScores(JSON.parse(savedScores));
      }
    }
  }, [user]);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/users/stats");
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Use configured api instance
      const response = await api.put("/api/users/profile", {
        username,
        email,
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(fetchUser());
        setEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use configured api instance
      const response = await api.put("/api/users/password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use configured api instance
      const response = await api.delete("/api/users/account", {
        data: { password: deletePassword },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E1EEBC] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalQuizzes = Object.keys(quizScores).length;
  const avgScore = totalQuizzes > 0
    ? Math.round(Object.values(quizScores).reduce((sum, q) => sum + q.percentage, 0) / totalQuizzes)
    : 0;

  return (
    <div className="min-h-screen bg-[#E1EEBC] py-8 px-4">
      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* User Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {user.role === "super-admin" ? "👑 Admin" : "🌱 Member"}
                </span>
                {stats && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Member for {stats.accountAge} days
                  </span>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">🔖</div>
            <div className="text-2xl font-bold text-gray-800">
              {Object.keys(bookmark).length}
            </div>
            <div className="text-sm text-gray-600">Bookmarked Plants</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-gray-800">{totalQuizzes}</div>
            <div className="text-sm text-gray-600">Quizzes Completed</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gray-800">{avgScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-gray-800">
              {stats ? stats.accountAge : 0}
            </div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-lg">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              👤 Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "security"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🔒 Security
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "activity"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📊 Activity
            </button>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Role
                    </label>
                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>

                  {editing && (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setUsername(user.username);
                          setEmail(user.email);
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>

                {/* Change Password */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </form>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Activity</h2>

                {/* Quiz Scores */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quiz Performance
                  </h3>
                  {totalQuizzes > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(quizScores).map(([quizId, scoreData]) => (
                        <div
                          key={quizId}
                          className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium text-gray-800">
                              Quiz #{quizId}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(scoreData.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                              {scoreData.percentage}%
                            </div>
                            <div className="text-sm text-gray-600">
                              {scoreData.score}/{scoreData.total}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      <div className="text-4xl mb-2">📝</div>
                      <p>No quizzes completed yet</p>
                      <button
                        onClick={() => navigate("/quizzes")}
                        className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Take a Quiz
                      </button>
                    </div>
                  )}
                </div>

                {/* Bookmarked Plants Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Bookmarked Plants
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      {Object.keys(bookmark).length}
                    </div>
                    <p className="text-gray-600 mb-4">Plants in your collection</p>
                    <button
                      onClick={() => navigate("/mygarden")}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      View My Garden
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
            <p className="text-gray-700 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Your password"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;