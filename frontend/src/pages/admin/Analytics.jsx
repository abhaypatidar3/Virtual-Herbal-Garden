// src/pages/admin/Analytics.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/config/api";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchAnalytics();
    fetchLogs();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/analytics", {
        params: { period }
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get("/api/admin/logs");
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights and reports</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      {/* User Registration Trend */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📊 User Registration Trend
        </h2>
        {analytics?.userRegistrations?.length > 0 ? (
          <div className="space-y-2">
            {analytics.userRegistrations.map((day) => (
              <div key={day._id} className="flex items-center gap-3">
                <div className="text-sm text-gray-600 w-28">
                  {new Date(day._id).toLocaleDateString()}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="bg-emerald-500 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{
                      width: `${Math.min(
                        (day.count /
                          Math.max(...analytics.userRegistrations.map((d) => d.count))) *
                          100,
                        100
                      )}%`,
                    }}
                  >
                    <span className="text-sm text-white font-medium">{day.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No data available</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            👥 User Role Distribution
          </h2>
          {analytics?.roleDistribution?.length > 0 ? (
            <div className="space-y-4">
              {analytics.roleDistribution.map((role) => (
                <div key={role._id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium capitalize">
                      {role._id === "super-admin" ? "👑 Admins" : "🌱 Users"}
                    </span>
                    <span className="text-gray-600">{role.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        role._id === "super-admin" ? "bg-purple-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${
                          (role.count /
                            analytics.roleDistribution.reduce((sum, r) => sum + r.count, 0)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No data available</p>
          )}
        </div>

        {/* Top Bookmarked Plants */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🏆 Most Bookmarked Plants
          </h2>
          {analytics?.plantBookmarkTrends?.length > 0 ? (
            <div className="space-y-3">
              {analytics.plantBookmarkTrends.map((plant, index) => (
                <div
                  key={plant.plantId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <div className="font-medium text-gray-800">{plant.plantName}</div>
                      <div className="text-sm text-gray-600">
                        {plant.bookmarkCount} bookmarks
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No data available</p>
          )}
        </div>
      </div>

      {/* Most Active Users */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ Most Active Users</h2>
        {analytics?.mostActiveUsers?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Bookmarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {analytics.mostActiveUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {user.bookmarkCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No data available</p>
        )}
      </div>

      {/* Recent Activity Logs */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Recent Activity</h2>
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {log.action === "User Registration" ? "👤" : "📝"}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{log.action}</div>
                  <div className="text-sm text-gray-600">
                    {log.user} ({log.email}) - {log.role}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No activity logs</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;