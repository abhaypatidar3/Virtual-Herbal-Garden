// src/pages/PlantInfo.jsx
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { PlantContext } from "../context/PlantContext";

export default function PlantInfo() {
  const { id } = useParams(); // /plantinfo/:id
  const { getPlantById, loading: ctxLoading, addToBookmark, saveToGarden,plants } = useContext(PlantContext);

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!plants || plants.length === 0) return; // wait until context data available

  let mounted = true;
  setError(null);
  setLoading(true);

  (async () => {
    try {
      const p = await getPlantById(id);
      if (!mounted) return;
      if (!p) {
        setError("Plant not found");
      } else {
        setPlant(p);
      }
    } catch (err) {
      if (mounted) setError(err.message || "Failed to load plant");
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, [id, plants, getPlantById]);


  if (ctxLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading plant...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-sm text-gray-700">{error}</p>
          <div className="mt-4">
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-green-600 text-white">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return null;
  }

  const {
    name,
    scientific_name,
    description = "",
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
  const plantId = _id || pid || id;
  const primaryImage = images?.title || images?.thumb || "";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2 bg-white rounded-2xl shadow p-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-full md:w-1/3">
              {primaryImage ? (
                <img src={primaryImage} alt={name} className="w-full h-64 object-cover rounded-xl shadow-sm" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">No image</div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2">
                <img src={images?.thumb || primaryImage} alt={`${name} thumb`} className="h-20 w-full object-cover rounded-lg" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                <img src={images?.title || primaryImage} alt={`${name} title`} className="h-20 w-full object-cover rounded-lg" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                <div className="h-20 w-full rounded-lg bg-gradient-to-tr from-green-100 to-green-50 flex items-center justify-center text-sm text-green-800">Garden Tips</div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{name}</h1>
              <p className="text-sm text-gray-600 mt-1 italic">{scientific_name}</p>

              <div className="mt-4 flex items-center gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">{type}</span>
                <span className="text-sm text-gray-500">ID #{plantId}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Updated {updatedDate}</span>
              </div>

              <p className="mt-6 text-gray-700 whitespace-pre-line">{description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => saveToGarden(plant)} className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:bg-green-700">Save to My Garden</button>

                <button onClick={() => addToBookmark(plant)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                  Bookmark
                </button>

                {link && (
                  <a href={link} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50" target="_blank" rel="noreferrer">
                    View source
                  </a>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-xs text-gray-500">Created</h4>
                  <p className="text-sm font-medium">{createdDate}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-xs text-gray-500">Last updated</h4>
                  <p className="text-sm font-medium">{updatedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside className="bg-white rounded-2xl shadow p-6" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.06 }}>
          <h3 className="text-lg font-semibold">Key facts</h3>
          <dl className="mt-4 space-y-3">
            {data?.length ? (
              data.map((d) => (
                <div key={d.key} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{d.key}</dt>
                  <dd className="text-sm font-medium text-gray-800">{d.value}</dd>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No facts available</div>
            )}
          </dl>

          <div className="mt-6">
            <h4 className="text-sm text-gray-500">Images</h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <img src={images?.thumb || primaryImage} alt="thumb" className="h-24 w-full object-cover rounded" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
              <img src={images?.title || primaryImage} alt="title" className="h-24 w-full object-cover rounded" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm text-gray-500">More data</h4>
            <div className="mt-2 text-sm text-gray-600">
              <pre className="whitespace-pre-wrap max-h-36 overflow-auto text-xs">{JSON.stringify(data || [], null, 2)}</pre>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={() => saveToGarden(plant)} className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700">Save to My Garden</button>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}


// still facing the same problem
// let's track it step by step
// tell me name of component and i will provide