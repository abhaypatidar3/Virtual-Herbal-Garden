import React, { useContext } from "react";
import PlantCard from "../components/PlantCard";
import { PlantContext } from "../context/PlantContext";

const Explore = () => {
  const { plants = [], loading, error, addToBookmark } = useContext(PlantContext);

  return (
    <div className="bg-[#E1EEBC] w-full h-full pb-[2vw]">
      <div className="pt-[13vh] pl-[5vw]">
        {/* top */}
        <div className="flex flex-row gap-[1vw] pb-2">
          <p className="text-3xl font-itim ">Explore Plants:</p>
          <select
            id="filter"
            className="border border-gray-600 rounded-full w-[30vw] sm:w-[12vw] text-xl text-center h-[37px] mt-[3px] bg-[#e5eccf] font-itim"
            aria-label="Filter plants"
          >
            <option value="filter" className="font-itim text-lg">
              FILTER
            </option>
            <option value="filter" className="font-itim text-lg">
              FILTER
            </option>
            <option value="filter" className="font-itim text-lg">
              FILTER
            </option>
            <option value="filter" className="font-itim text-lg">
              FILTER
            </option>
          </select>
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
          plants.map((plant) => (
            <PlantCard
              key={String(plant.id)}
              id={plant.id}
              name={plant.name}
              SN={plant.scientific_name}
              image={plant.images?.title || plant.images?.thumb || ""}
              // optional: pass bookmark handler so the icon in PlantCard can call it
              addToBookmark={() => addToBookmark(plant.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default Explore;
