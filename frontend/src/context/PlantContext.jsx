import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const PlantContext = createContext();

const PlantContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [bookmark, setBookmark] = useState({});
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plants from backend
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/api/plants'); // backend proxy
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Plant data:', data);

        // Adjust depending on API response structure
        setPlants(data.plants || data || []);

      } catch (err) {
        console.error('Error fetching plants:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Bookmark function
  const addToBookmark = (plantId) => {
    toast.success("Bookmarked plant", {
      onClick: () => navigate("/mygarden"),
      className: 'cursor-pointer',
      autoClose: 3000
    });

    const bookmarkData = structuredClone(bookmark);
    bookmarkData[plantId] = true;
    setBookmark(bookmarkData);
  };

  const value = {
    search, setSearch,
    showSearch, setShowSearch,
    bookmark, setBookmark,
    plants, setPlants,
    loading, setLoading,
    error,
    addToBookmark
  };

  return (
    <PlantContext.Provider value={value}>
      {children}
    </PlantContext.Provider>
  );
};

export default PlantContextProvider;
