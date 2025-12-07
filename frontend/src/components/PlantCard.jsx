// src/components/PlantCard.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { PlantContext } from "../context/PlantContext";


const PlantCard = ({ plant, addToBookmark }) => {
  const { bookmark = {} } = useContext(PlantContext);
  
  // Extract stable ID from plant object
  const plantId = plant._id ?? plant.id;
  const linkId = encodeURIComponent(String(plantId ?? ""));
  
  // Check if this plant is bookmarked
  const isBookmarked = bookmark[String(plantId)] === true;
  
  // Extract display data
  const image = plant.images?.title || plant.images?.thumb || plant.image || "";
  const name = plant.name || plant.common_name || "Unknown";
  const scientificName = plant.scientific_name || plant.scientificName || "N/A";

  const handleBookmarkClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking bookmark
    e.stopPropagation();
    if (addToBookmark) {
      addToBookmark(plantId);
    }
  };

  return (
    <Link
      to={`/plantinfo/${linkId}`}
      state={{ plant }}
      className="w-[30vh] h-[33vh] sm:w-[36vh] sm:h-[39vh] border border-[#008080] flex flex-col justify-center rounded-3xl mb-[2vw] bg-white hover:scale-105 duration-150 hover:shadow-[0_0_20px_2px_rgba(0,128,128,0.4)] hover:border-[#00a0a0]"
    >
      <div className="ml-[2.3vh] sm:ml-[1.5vw]">
        <img
          src={image}
          alt={name || "Plant image"}
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          className="bg-slate-200 h-[22vh] sm:h-[27vh] w-[25vh] sm:w-[30vh] rounded-3xl border border-gray-400 object-cover"
        />
      </div>

      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col flex-1 min-w-0">
          <p className="pl-[2.5vh] pt-2 sm:pl-[1.7vw] font-itim text-2xl text-gray-800 truncate">
            Plant: {name}
          </p>
          <p className="pl-[2.5vh] sm:pl-[1.7vw] font-sans italic text-base text-slate-600 truncate">
            Scientific Name: {scientificName}
          </p>
        </div>
        <img
          src={assets.bookmark}
          className={`w-5 h-5 mt-7 mr-7 cursor-pointer select-none hover:scale-110 transition-transform ${
            isBookmarked ? 'opacity-100 filter brightness-75' : 'opacity-70'
          }`}
          alt="Bookmark icon"
          draggable="false"
          onClick={handleBookmarkClick}
          style={isBookmarked ? { filter: 'sepia(1) saturate(3) hue-rotate(20deg)' } : {}}
        />
      </div>
    </Link>
  );
};

export default PlantCard;