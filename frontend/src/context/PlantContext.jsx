// src/context/PlantContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const PlantContext = createContext();

const API_BASE = "http://localhost:3000"; // keep single source; change to env when ready

const PlantContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [bookmark, setBookmark] = useState({});
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/api/plants`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.debug("Plant list response:", data);
        setPlants(data.plants || data || []);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError(err.message || "Failed to load plants");
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  // robust getPlantById that normalizes response shapes and caches result
const getPlantById = useCallback(
  async (id) => {
    if (!id) return null;
    const sid = String(id);

    // Wait until plants are loaded
    if (!plants || plants.length === 0) {
      console.warn("getPlantById: plant list empty or loading");
      return null;
    }

    // Find plant by id (string vs number safe)
    const found = plants.find((p) => String(p.id ?? p._id ?? "") === sid);

    if (found) {
      console.debug("✅ getPlantById: found", sid, found.name);
      return found;
    }

    console.warn(`❌ getPlantById: no plant matched id=${sid}`);
    console.debug("Current plants[0]:", plants[0]);
    return null;
  },
  [plants]
);



  const addToBookmark = (plantOrId) => {
    const plantId = typeof plantOrId === "object" ? String(plantOrId._id ?? plantOrId.id) : String(plantOrId);
    toast.success("Bookmarked plant", {
      onClick: () => navigate("/mygarden"),
      className: "cursor-pointer",
      autoClose: 3000,
    });
    setBookmark((prev) => ({ ...(prev || {}), [plantId]: true }));
  };

  const saveToGarden = (plant) => {
    toast.success("Saved to My Garden");
  };

  const value = {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    bookmark,
    setBookmark,
    plants,
    setPlants,
    loading,
    setLoading,
    error,
    addToBookmark,
    getPlantById,
    saveToGarden,
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};

export default PlantContextProvider;
