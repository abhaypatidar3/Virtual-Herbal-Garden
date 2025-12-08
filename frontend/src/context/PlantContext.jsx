// src/context/PlantContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

export const PlantContext = createContext();
const API_BASE = "https://virtual-herbal-garden-ccq6.onrender.com" || "http://localhost:3000";

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE;

// Helper function to normalize plant data structure
const normalizePlant = (plant) => ({
  ...plant,
  id: plant._id ?? plant.id,
  _id: plant._id ?? plant.id,
  name: plant.name ?? plant.common_name ?? "Unknown",
  scientific_name: plant.scientific_name ?? plant.scientificName ?? "",
  images: {
    title: plant.images?.title ?? plant.images?.thumb ?? plant.image ?? "",
    thumb: plant.images?.thumb ?? plant.images?.title ?? plant.image ?? "",
    ...plant.images
  },
  image: plant.image ?? plant.images?.title ?? plant.images?.thumb ?? "",
});

const PlantContextProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // Get user from Redux
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [bookmark, setBookmark] = useState({});
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // Fetch plants
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);

      try {
        const [res1, res2] = await Promise.all([
          fetch(`${API_BASE}/api/external-plants`),
          fetch(`${API_BASE}/api/plants`)
        ]);

        if (!res1.ok) throw new Error(`External Plants HTTP ${res1.status}`);
        if (!res2.ok) throw new Error(`Plants HTTP ${res2.status}`);

        const data1 = await res1.json();
        const data2 = await res2.json();

        console.debug("External plants response:", data1);
        console.debug("Plants response:", data2);

        const list1 = Array.isArray(data1.plants) ? data1.plants 
                    : Array.isArray(data1.data) ? data1.data 
                    : [];

        const list2 = Array.isArray(data2.plants) ? data2.plants 
                    : Array.isArray(data2.data) ? data2.data 
                    : [];

        const merged = [...list1, ...list2].map(normalizePlant);

        console.debug(`✅ Loaded ${merged.length} plants (${list1.length} external + ${list2.length} internal)`);

        setPlants(merged);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError(err.message || "Failed to load plants");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Fetch user bookmarks from backend
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!isAuthenticated || !user) {
        setBookmark({});
        return;
      }

      setBookmarksLoading(true);
      try {
        const response = await axios.get("/api/bookmarks");
        
        if (response.data.success) {
          // Backend returns array of plant IDs (strings or ObjectIds)
          const bookmarkMap = {};
          response.data.bookmarks.forEach((plantId) => {
            // Convert to string for consistent comparison
            const id = String(plantId);
            bookmarkMap[id] = true;
          });
          setBookmark(bookmarkMap);
          console.debug("✅ Loaded bookmark IDs:", Object.keys(bookmarkMap));
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        // If unauthorized, clear bookmarks
        if (err.response?.status === 401) {
          setBookmark({});
        }
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, user]);

  // Get plant by ID
  const getPlantById = useCallback(
    async (id) => {
      if (!id) return null;
      const sid = String(id);

      if (!plants || plants.length === 0) {
        console.warn("getPlantById: plant list empty or loading");
        return null;
      }

      const found = plants.find((p) => {
        const candidates = [p.id, p._id, p._id?.toString?.(), p.id?.toString?.()];
        return candidates.some((c) => String(c ?? "") === sid);
      });

      if (found) {
        console.debug("✅ getPlantById: found locally", sid, found.name ?? found.title);
        return found;
      }

      console.warn(`❌ getPlantById: no plant matched id=${sid} locally — trying backend`);

      try {
        const resLocal = await fetch(`${API_BASE}/api/plants/${encodeURIComponent(sid)}`);
        if (resLocal.ok) {
          const json = await resLocal.json();
          const candidate = json.plant ?? json.data ?? json;
          if (candidate) return normalizePlant(candidate);
        }

        const resExt = await fetch(`${API_BASE}/api/external-plants/${encodeURIComponent(sid)}`);
        if (resExt.ok) {
          const json = await resExt.json();
          const candidate = json.plant ?? json.data ?? json;
          if (candidate) return normalizePlant(candidate);
        }
      } catch (err) {
        console.error("getPlantById: backend fetch failed", err);
      }

      console.warn(`getPlantById: still no plant found for id=${sid}`);
      return null;
    },
    [plants]
  );

  // Add to bookmark (API call)
  const addToBookmark = async (plantOrId) => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark plants", {
        onClick: () => navigate("/login"),
        className: "cursor-pointer",
      });
      return;
    }

    const plantId = typeof plantOrId === "object" 
      ? String(plantOrId._id ?? plantOrId.id) 
      : String(plantOrId);

    try {
      const response = await axios.post("/api/bookmarks", { plantId });
      
      if (response.data.success) {
        toast.success("Bookmarked plant", {
          onClick: () => navigate("/mygarden"),
          className: "cursor-pointer",
          autoClose: 3000,
        });
        
        // Update local state
        setBookmark((prev) => ({ ...prev, [plantId]: true }));
      }
    } catch (err) {
      console.error("Error adding bookmark:", err);
      
      if (err.response?.status === 400 && err.response?.data?.message === "Already bookmarked") {
        toast.info("Already bookmarked");
      } else if (err.response?.status === 401) {
        toast.error("Please login to bookmark plants");
      } else {
        toast.error(err.response?.data?.message || "Failed to bookmark plant");
      }
    }
  };

  // Remove from bookmark (API call)
  const removeFromBookmark = async (plantOrId) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    const plantId = typeof plantOrId === "object" 
      ? String(plantOrId._id ?? plantOrId.id) 
      : String(plantOrId);

    try {
      const response = await axios.delete(`/api/bookmarks/${plantId}`);
      
      if (response.data.success) {
        toast.info("Removed from bookmarks", {
          autoClose: 2000,
        });
        
        // Update local state
        setBookmark((prev) => {
          const updated = { ...prev };
          delete updated[plantId];
          return updated;
        });
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
      toast.error(err.response?.data?.message || "Failed to remove bookmark");
    }
  };

  const saveToGarden = (plant) => {
    // You can implement this to add to a separate "My Garden" list
    // For now, we'll just use bookmarks
    addToBookmark(plant);
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
    bookmarksLoading,
    addToBookmark,
    removeFromBookmark,
    getPlantById,
    saveToGarden,
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};

export default PlantContextProvider;
