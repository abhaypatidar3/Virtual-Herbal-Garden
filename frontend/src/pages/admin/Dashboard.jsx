// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Configure axios
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching dashboard stats...");
      const { data } = await api.get("/api/admin/dashboard/stats");
      
      console.log("✅ Dashboard data received:", data);
      setStats(data.stats);
    } catch (error) {
      console.error("❌ Dashboard fetch error:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch stats";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-6xl">⚠️</div>
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-semibold mb-2">Common issues:</p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Backend server not running</li>
              <li>Not logged in as super-admin</li>
              <li>AdminController not properly set up</li>
              <li>Database connection issue</li>
            </ul>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon="👥"
          color="bg-blue-500"
          subtitle={`${stats.totalAdmins || 0} admins`}
        />
        <StatCard
          title="Total Plants"
          value={stats.totalPlants || 0}
          icon="🌿"
          color="bg-emerald-500"
        />
        <StatCard
          title="Total Bookmarks"
          value={stats.totalBookmarks || 0}
          icon="📑"
          color="bg-purple-500"
        />
        <StatCard
          title="New Users (7d)"
          value={stats.recentUsers || 0}
          icon="🆕"
          color="bg-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📈 User Growth (Last 30 Days)
          </h2>
          {stats.userGrowth && stats.userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No user growth data yet</p>
            </div>
          )}
        </div>

        {/* Top Bookmarked Plants */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🔖 Most Bookmarked Plants
          </h2>
          {stats.topBookmarkedPlants && stats.topBookmarkedPlants.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topBookmarkedPlants}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plantName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="bookmarkCount"
                  fill="#3b82f6"
                  name="Bookmarks"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🔖</div>
              <p>No bookmarks yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🕒 Recent Activity
        </h2>
        {stats.topBookmarkedPlants && stats.topBookmarkedPlants.length > 0 ? (
          <div className="space-y-3">
            {stats.topBookmarkedPlants.slice(0, 5).map((plant, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <p className="font-medium text-gray-800">{plant.plantName}</p>
                    <p className="text-sm text-gray-500">
                      {plant.bookmarkCount} bookmarks
                    </p>
                  </div>
                </div>
                <span className="text-emerald-600 font-semibold">Popular</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Manage Users"
          description="View and manage all users"
          icon="👥"
          link="/admin/users"
        />
        <QuickActionCard
          title="Manage Plants"
          description="Add, edit, or delete plants"
          icon="🌿"
          link="/admin/plants"
        />
        <QuickActionCard
          title="View Analytics"
          description="Detailed reports and insights"
          icon="📊"
          link="/admin/analytics"
        />
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);

// Quick Action Card
const QuickActionCard = ({ title, description, icon, link }) => (
  <a
    href={link}
    className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
  >
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </a>
);

export default Dashboard;