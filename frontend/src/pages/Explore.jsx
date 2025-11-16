// src/pages/Explore.jsx
import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PlantCard from "../components/PlantCard";
import { PlantContext } from "../context/PlantContext";

const Explore = () => {
  const { plants = [], loading, error, addToBookmark } = useContext(PlantContext);
  const { isAuthenticated } = useSelector((state) => state.user);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [filteredPlants, setFilteredPlants] = useState([]);

  // Extract unique regions from plants
  const regions = [...new Set(plants.map(p => p.region).filter(Boolean))].sort();

  // Filter and sort plants
  useEffect(() => {
    let result = [...plants];

    // 1. Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter((plant) =>
        plant.name?.toLowerCase().includes(search) ||
        plant.scientificName?.toLowerCase().includes(search) ||
        plant.region?.toLowerCase().includes(search)
      );
    }

    // 2. Region filter
    if (selectedRegion !== "all") {
      result = result.filter((plant) => plant.region === selectedRegion);
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredPlants(result);
  }, [plants, searchTerm, sortBy, selectedRegion]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("name-asc");
    setSelectedRegion("all");
  };

  const hasActiveFilters = searchTerm || sortBy !== "name-asc" || selectedRegion !== "all";

  return (
    <div className="bg-[#E1EEBC] w-full min-h-screen pb-[2vw]">
      <div className="pt-[13vh] px-[5vw]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-itim">Explore Plants</h1>
            <span className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-full font-medium">
              {filteredPlants.length} {filteredPlants.length === 1 ? 'plant' : 'plants'}
            </span>
          </div>

          {/* Login hint */}
          {!isAuthenticated && (
            <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
              💡 <a href="/login" className="underline hover:text-gray-900">Login</a> to bookmark plants
            </div>
          )}
        </div>

        {/* Search & Filters Section */}
        <div className="bg-[#E1EEBC] rounded-xl shadow-md p-4 mb-6 border border-gray-400">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by plant name, scientific name, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-itim text-lg bg-slate-100"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-itim">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-itim"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-itim">
                Filter by Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-itim"
              >
                <option value="all">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={`w-full px-4 py-2 rounded-lg font-medium font-itim transition-colors ${
                  hasActiveFilters
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-emerald-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedRegion !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Region: {selectedRegion}
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className="hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {sortBy !== "name-asc" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Sort: {sortBy === "name-desc" ? "Z-A" : sortBy === "newest" ? "Newest" : "Oldest"}
                  <button
                    onClick={() => setSortBy("name-asc")}
                    className="hover:text-purple-900"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Plants Grid */}
      <div className="border bg-[#EAFFD8] border-gray-400 mx-[5vw] min-h-[70vh] overflow-y-auto grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 scrollbar-hide lg:grid-cols-4 pt-[3vh] sm:pt-[5vh] justify-center sm:px-0 gap-[2vh] sm:pl-[4vw] rounded-2xl">
        {/* Loading state */}
        {loading && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
            <div className="text-lg text-gray-700 font-itim">Loading plants…</div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 gap-4">
            <div className="text-5xl">🌱❌</div>
            <div className="text-red-600 font-itim text-lg">
              Error loading plants: {String(error)}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* No results state */}
        {!loading && !error && filteredPlants.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 gap-4">
            <div className="text-5xl">🔍🌿</div>
            <div className="text-gray-700 font-itim text-lg">
              {hasActiveFilters
                ? "No plants match your filters"
                : "No plants found"}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-itim"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Plant cards */}
        {!loading &&
          !error &&
          filteredPlants.map((plant) => {
            const stableKey = String(plant._id ?? plant.id ?? Math.random());
            
            return (
              <PlantCard
                key={stableKey}
                plant={plant}
                addToBookmark={addToBookmark}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Explore;