// src/pages/admin/UserDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";
axios.defaults.withCredentials = true;

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/users/${userId}`);
      
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user details");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
          <p className="text-gray-600 mt-1">Detailed information about {user.username}</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "super-admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role === "super-admin" ? "👑 Admin" : "🌱 User"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Account Age</div>
            <div className="text-2xl font-bold text-gray-800">{user.accountAge} days</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Bookmarks</div>
            <div className="text-2xl font-bold text-gray-800">{user.bookmarkCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Joined</div>
            <div className="text-lg font-bold text-gray-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarked Plants */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🔖 Bookmarked Plants ({user.bookmarks?.length || 0})
        </h2>
        {user.bookmarks && user.bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.bookmarks.map((plant) => (
              <div key={plant._id} className="border rounded-lg p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {plant.image ? (
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🌿
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">{plant.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <div className="text-4xl mb-2">🔖</div>
            <p>No bookmarked plants</p>
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Activity Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Account Created</div>
              <div className="text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          {user.updatedAt && (
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">✏️</div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Last Updated</div>
                <div className="text-sm text-gray-600">
                  {new Date(user.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;