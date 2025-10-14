import React, { useEffect, useState } from "react";

const MyGarden = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch(() => {
        setPlants([
          {
            id: 1,
            name: "Aloe Vera",
            scientific: "Aloe barbadensis miller",
            img: "/src/assets/money_plant.jpg",
          },
          {
            id: 2,
            name: "Tulsi",
            scientific: "Ocimum tenuiflorum",
            img: "/src/assets/expPlants.jpg",
          },
          {
            id: 3,
            name: "Neem",
            scientific: "Azadirachta indica",
            img: "/src/assets/Ayush.jpg",
          },
        ]);
      });
  }, []);

  return (
    <div className="px-4 pt-28 pb-8">
      <h2 className="text-xl font-semibold mb-8">BOOKMARKS :</h2>

      <div className="flex flex-col gap-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition"
          >
            
            <div className="flex items-center gap-4">
              <img
                src={plant.img}
                alt={plant.name}
                className="w-20 h-20 rounded-lg object-cover border"
              />
              <div>
                <h3 className="font-bold text-lg uppercase tracking-wide">
                  {plant.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Scientific: {plant.scientific}
                </p>
              </div>
            </div>

         
            <div className="mt-4 flex items-center justify-between">
              <button className="px-4 py-1 bg-lime-200 rounded-full text-sm font-medium hover:bg-lime-300 transition">
                view details
              </button>
              <button className="text-gray-500 hover:text-red-500">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGarden;
