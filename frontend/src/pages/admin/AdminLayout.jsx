// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  // Redirect if not admin
  if (!isAuthenticated || user?.role !== "super-admin") {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: "/admin/dashboard", label: "📊 Dashboard", icon: "📊" },
    { path: "/admin/users", label: "👥 Users", icon: "👥" },
    { path: "/admin/plants", label: "🌿 Plants", icon: "🌿" },
    { path: "/admin/analytics", label: "📈 Analytics", icon: "📈" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user.username}</p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label.split(" ")[1]}</span>
                </Link>
              ))}

              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mt-8"
              >
                <span className="text-xl">🏠</span>
                <span className="font-medium">Back to Site</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;