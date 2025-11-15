// src/pages/PlantInfo.jsx
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { PlantContext } from "../context/PlantContext";

export default function PlantInfo() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { getPlantById, addToBookmark, saveToGarden, normalizePlant } = useContext(PlantContext);

  const [plant, setPlant] = useState(location.state?.plant ?? null);
  const [loading, setLoading] = useState(!location.state?.plant);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    // If we already have plant from navigation state, no need to fetch
    if (location.state?.plant) {
      setLoading(false);
      return () => { mounted = false; };
    }

    // If no paramId, we can't fetch anything
    if (!paramId) {
      setError("No plant ID provided");
      setLoading(false);
      return () => { mounted = false; };
    }

    // Fetch plant by ID
    const fetchPlant = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPlant = await getPlantById(paramId);
        
        if (!mounted) return;

        if (fetchedPlant) {
          setPlant(fetchedPlant);
        } else {
          setError("Plant not found");
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load plant");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPlant();

    return () => {
      mounted = false;
    };
  }, [paramId, location.state?.plant, getPlantById]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading plant...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-sm text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => navigate("/explore")} 
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // No plant found
  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-gray-700 mb-6">Plant not found.</p>
          <button 
            onClick={() => navigate("/explore")} 
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  // Extract plant data with defaults
  const {
    name = "Unknown plant",
    scientific_name = "",
    description = "No description available.",
    images = {},
    created_at,
    updated_at,
    link,
    data = [],
    _id,
    id: pid,
    type = "Plant",
  } = plant;

  const createdDate = created_at ? new Date(created_at).toLocaleDateString() : "—";
  const updatedDate = updated_at ? new Date(updated_at).toLocaleDateString() : "—";
  const plantId = _id || pid || paramId;
  const primaryImage = images?.title || images?.thumb || "";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl shadow p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image section */}
              <div className="flex-shrink-0 w-full md:w-1/3">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={name}
                    className="w-full h-64 object-cover rounded-xl shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {images?.thumb && (
                    <img
                      src={images.thumb}
                      alt={`${name} thumbnail`}
                      className="h-20 w-full object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  {images?.title && images.title !== images.thumb && (
                    <img
                      src={images.title}
                      alt={`${name} title`}
                      className="h-20 w-full object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <div className="h-20 w-full rounded-lg bg-gradient-to-tr from-green-100 to-green-50 flex items-center justify-center text-xs text-green-800 font-medium">
                    🌱 Garden Tips
                  </div>
                </div>
              </div>

              {/* Details section */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
                  {name}
                </h1>
                {scientific_name && (
                  <p className="text-sm text-gray-600 mt-1 italic">{scientific_name}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    {type}
                  </span>
                  {plantId && (
                    <span className="text-xs text-gray-500">ID: {String(plantId).slice(0, 8)}</span>
                  )}
                  {updatedDate !== "—" && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">Updated {updatedDate}</span>
                    </>
                  )}
                </div>

                {description && (
                  <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                )}

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => saveToGarden(plant)}
                    className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700 transition-colors"
                  >
                    🌿 Save to My Garden
                  </button>

                  <button
                    onClick={() => addToBookmark(plant)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    🔖 Bookmark
                  </button>

                  {link && (
                    <a
                      href={link}
                      className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      target="_blank"
                      rel="noreferrer"
                    >
                      🔗 View Source
                    </a>
                  )}
                </div>

                {/* Date info */}
                {(createdDate !== "—" || updatedDate !== "—") && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {createdDate !== "—" && (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <h4 className="text-xs text-gray-500 uppercase tracking-wide">Created</h4>
                        <p className="text-sm font-medium text-gray-900 mt-1">{createdDate}</p>
                      </div>
                    )}
                    {updatedDate !== "—" && (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <h4 className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</h4>
                        <p className="text-sm font-medium text-gray-900 mt-1">{updatedDate}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            className="bg-white rounded-2xl shadow p-6"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
          >
            <h3 className="text-lg font-semibold text-gray-900">Key Facts</h3>
            <dl className="mt-4 space-y-3">
              {data?.length > 0 ? (
                data.map((d, idx) => (
                  <div key={d.key ?? idx} className="flex justify-between gap-2">
                    <dt className="text-sm text-gray-600">{d.key}</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{d.value}</dd>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No additional facts available</div>
              )}
            </dl>

            {/* Image gallery */}
            {(images?.thumb || images?.title) && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Gallery</h4>
                <div className="grid grid-cols-2 gap-2">
                  {images.thumb && (
                    <img
                      src={images.thumb}
                      alt="Thumbnail"
                      className="h-24 w-full object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  {images.title && images.title !== images.thumb && (
                    <img
                      src={images.title}
                      alt="Main"
                      className="h-24 w-full object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Raw data (for debugging/development) */}
            {data?.length > 0 && (
              <details className="mt-6">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Raw Data
                </summary>
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                  <pre className="whitespace-pre-wrap max-h-36 overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </details>
            )}

            {/* CTA button */}
            <div className="mt-6">
              <button
                onClick={() => saveToGarden(plant)}
                className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
              >
                💚 Add to My Garden
              </button>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}