// src/pages/Explore.jsx
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import PlantCard from "../components/PlantCard";
import { PlantContext } from "../context/PlantContext";

const Explore = () => {
  const { plants = [], loading, error, addToBookmark } = useContext(PlantContext);
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <div className="bg-[#E1EEBC] w-full h-full pb-[2vw]">
      <div className="pt-[13vh] pl-[5vw]">
        {/* top */}
        <div className="flex flex-row gap-[1vw] pb-2 items-center">
          <p className="text-3xl font-itim ">Explore Plants:</p>
          <select
            id="filter"
            className="border border-gray-600 rounded-full w-[30vw] sm:w-[12vw] text-xl text-center h-[37px] mt-[3px] bg-[#e5eccf] font-itim"
            aria-label="Filter plants"
          >
            <option value="filter" className="font-itim text-lg">
              FILTER
            </option>
          </select>
          
          {/* Login hint */}
          {!isAuthenticated && (
            <div className="ml-auto mr-[5vw] text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
              💡 <a href="/login" className="underline hover:text-gray-900">Login</a> to bookmark plants
            </div>
          )}
        </div>
      </div>

      <div className="border bg-[#EAFFD8] border-gray-400 mx-[5vw] min-h-[70vh] overflow-y-auto grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 scrollbar-hide lg:grid-cols-4 pt-[3vh] sm:pt-[5vh] justify-center sm:px-0 gap-[2vh] sm:pl-[4vw] rounded-2xl">
        {/* Loading / error / empty states */}
        {loading && (
          <div className="col-span-full flex items-center justify-center p-8">
            <div className="text-lg text-gray-700">Loading plants…</div>
          </div>
        )}

        {error && !loading && (
          <div className="col-span-full flex items-center justify-center p-8">
            <div className="text-red-600">Error loading plants: {String(error)}</div>
          </div>
        )}

        {!loading && !error && plants.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8">
            <div className="text-gray-700">No plants found.</div>
          </div>
        )}

        {/* Plant cards */}
        {!loading &&
          !error &&
          plants.map((plant) => {
            // Create stable key from available IDs
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