// src/pages/MyGarden.jsx
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlantContext } from "../context/PlantContext";
import PlantCard from "../components/PlantCard";

const MyGarden = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  const { 
    plants = [], 
    bookmark = {}, 
    loading, 
    bookmarksLoading,
    error, 
    addToBookmark, 
    removeFromBookmark 
  } = useContext(PlantContext);

  // Filter plants that are bookmarked
  const bookmarkedPlants = useMemo(() => {
    const bookmarkedIds = Object.keys(bookmark).filter(id => bookmark[id] === true);
    
    return plants.filter(plant => {
      const plantId = String(plant._id ?? plant.id);
      return bookmarkedIds.includes(plantId);
    });
  }, [plants, bookmark]);

  return (
    <div className="bg-[#E1EEBC] w-full min-h-screen pb-[2vw]">
      <div className="pt-[13vh] px-[5vw]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <h1 className="text-4xl font-itim text-gray-800">My Garden 🌿</h1>
            <p className="text-lg text-gray-600 mt-1">
              {bookmarkedPlants.length} {bookmarkedPlants.length === 1 ? 'plant' : 'plants'} in your collection
            </p>
          </div>
          
          {bookmarkedPlants.length > 0 && (
            <div className="mt-4 sm:mt-0">
              <select
                id="sort"
                className="border border-gray-600 rounded-full px-4 py-2 text-base bg-[#e5eccf] font-itim"
                aria-label="Sort plants"
              >
                <option value="recent">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="scientific">Scientific Name</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="border bg-[#EAFFD8] border-gray-400 mx-[5vw] min-h-[70vh] rounded-2xl">
        {/* Loading state */}
        {(loading || bookmarksLoading) && (
          <div className="flex items-center justify-center p-12">
            <div className="text-lg text-gray-700">
              {bookmarksLoading ? "Loading your bookmarks..." : "Loading plants..."}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center justify-center p-12">
            <div className="text-red-600">Error loading plants: {String(error)}</div>
          </div>
        )}

        {/* Empty state - no bookmarks */}
        {!loading && !bookmarksLoading && !error && bookmarkedPlants.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-itim text-gray-700 mb-2">Your garden is empty</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Start building your collection by bookmarking plants you love from the Explore page!
            </p>
            <a
              href="/explore"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-itim hover:bg-green-700 transition-colors"
            >
              Explore Plants
            </a>
          </div>
        )}

        {/* Bookmarked plants grid */}
        {!loading && !bookmarksLoading && !error && bookmarkedPlants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 sm:p-8">
            {bookmarkedPlants.map((plant) => {
              const plantId = String(plant._id ?? plant.id);
              
              return (
                <div key={plantId} className="relative group">
                  <PlantCard
                    plant={plant}
                    addToBookmark={addToBookmark}
                  />
                  
                  {/* Remove button overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromBookmark(plantId);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg z-10"
                    title="Remove from garden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats section */}
      {!loading && !error && bookmarkedPlants.length > 0 && (
        <div className="mx-[5vw] mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Total Plants</div>
            <div className="text-2xl font-bold text-green-600">{bookmarkedPlants.length}</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Plant Types</div>
            <div className="text-2xl font-bold text-green-600">
              {new Set(bookmarkedPlants.map(p => p.type || 'Plant')).size}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Collection Status</div>
            <div className="text-lg font-semibold text-green-600">
              {bookmarkedPlants.length < 5 ? '🌱 Growing' : 
               bookmarkedPlants.length < 15 ? '🌿 Thriving' : '🌳 Flourishing'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGarden;