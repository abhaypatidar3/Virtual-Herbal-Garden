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
            desc:"Its easy to grow, requiring minimal water and thriving in warm, sunny conditions — making it a popular household plant as well as a key ingredient in skincare and health products."
          },
          {
            id: 2,
            name: "Tulsi",
            scientific: "Ocimum tenuiflorum",
            img: "/src/assets/expPlants.jpg",
            desc:"Apart from its health uses, tulsi is also worshipped in many Indian households, symbolizing purity, protection, and spiritual harmony. Its commonly consumed as tulsi tea or used in herbal remedies."
          },
          {
            id: 3,
            name: "Neem",
            scientific: "Azadirachta indica",
            img: "/src/assets/Ayush.jpg",
            desc:"In addition to health benefits, neem is also used as a natural pesticide and insect repellent, making it an eco-friendly choice in organic farming. Its often called the “village pharmacy” for its wide range of healing uses."
          },
        ]);
      });
  }, []);

  return (
    <div className="bg-[#e1eebc] h-full">
        <div className="px-[3.7vw] pt-28">
          <h2 className="font-itim text-3xl pl-5 pt-3 mb-5">BOOKMARKS :</h2>

          <div className="flex flex-col gap-6 pb-8 px-5">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition flex justify-between h-[40vh]"
              >

                <div className="flex items-center gap-4">
                  <img
                    src={plant.img}
                    alt={plant.name}
                    className="w-80 h-80 rounded-lg object-cover border"
                  />
                  <div className="flex flex-col h-[35vh] gap-8 pt-0 mt-0 justify-between">
                    <div className="mt-0">
                      <h3 className="font-bold text-3xl mt-3 uppercase tracking-wide">
                        {plant.name}
                      </h3>
                      <p className="text-lg text-gray-600 py-2">
                        Scientific: {plant.scientific}
                      </p>
                      <p className="text-gray-600 text-base w-[50vw]">Description: {plant.desc}</p>
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                      <button className="px-4 py-1 bg-lime-200 rounded-full text-sm font-medium hover:bg-lime-300 transition w-[15vw] h-[5vh]">
                        view details
                      </button>
                    </div>
                  </div>
                </div>
            
            
                <button className="text-gray-500 hover:text-red-500">🗑</button>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};

export default MyGarden;
