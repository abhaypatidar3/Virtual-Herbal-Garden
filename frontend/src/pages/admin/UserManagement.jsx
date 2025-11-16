// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";
axios.defaults.withCredentials = true;

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/admin/users`, {
        params: {
          page: pagination.page,
          limit: 10,
          search,
          role: roleFilter
        }
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete(`${API_BASE}/api/admin/users/${userToDelete._id}`);
      
      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await axios.put(`${API_BASE}/api/admin/users/${userId}`, updates);
      
      if (response.data.success) {
        toast.success("User updated successfully");
        fetchUsers();
        setEditingUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={handleSearch}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={roleFilter}
            onChange={handleRoleFilter}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="super-admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bookmarks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-800">
                          {user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "super-admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "super-admin" ? "👑 Admin" : "🌱 User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.bookmarkCount}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white border rounded-lg">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Delete User</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <strong>{userToDelete?.username}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
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

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user._id, { username, email, role });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="user">User</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;