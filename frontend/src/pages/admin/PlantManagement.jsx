// src/pages/admin/PlantManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const PlantManagement = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    fetchPlants();
  }, [pagination.page, searchTerm]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/plants", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
        },
      });
      setPlants(data.plants);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch plants");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Plant name is required");
      return;
    }

    try {
      if (editingPlant) {
        // Update plant
        await axios.put(`/api/admin/plants/${editingPlant._id}`, formData);
        toast.success("Plant updated successfully");
      } else {
        // Create plant
        await axios.post("/api/admin/plants", formData);
        toast.success("Plant created successfully");
      }
      closeModal();
      fetchPlants();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (plantId) => {
    if (!window.confirm("Are you sure you want to delete this plant?")) return;

    try {
      await axios.delete(`/api/admin/plants/${plantId}`);
      toast.success("Plant deleted successfully");
      fetchPlants();
    } catch (error) {
      toast.error("Failed to delete plant");
    }
  };

  const openModal = (plant = null) => {
    if (plant) {
      setEditingPlant(plant);
      setFormData({
        name: plant.name,
        image: plant.image || "",
      });
    } else {
      setEditingPlant(null);
      setFormData({ name: "", image: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlant(null);
    setFormData({ name: "", image: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Plant Management</h1>
          <p className="text-gray-600 mt-2">Manage all plants in the system</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add New Plant
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="🔍 Search plants by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Plants Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600"></div>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plants found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plants.map((plant) => (
                <tr key={plant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {plant.image ? (
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        🌿
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{plant.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(plant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openModal(plant)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plant._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingPlant ? "Edit Plant" : "Add New Plant"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter plant name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  {editingPlant ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantManagement;