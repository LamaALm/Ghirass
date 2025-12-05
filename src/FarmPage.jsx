import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "./Ghirass-Logo.png";

export default function FarmPage() {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [farmerName, setFarmerName] = useState("");

  useEffect(() => {
    fetch("https://ghirass-api.onrender.com/crops")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((c) => c.farmerId === farmerId);
        setCrops(filtered);
        if (filtered.length > 0) {
          setFarmerName(filtered[0].farmer || "Farmer");
        }
      })
      .catch((err) => console.error("Error fetching farm crops:", err));
  }, [farmerId]);

  return (
    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#3e5e40]">
            {farmerName ? `${farmerName}'s Farm` : "Farm Products"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-[#3e5e40] mt-1"
          >
            ← Back
          </button>
        </div>

        <img
          src={logo}
          alt="Ghirass Logo"
          className="h-16 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/")}
        />
      </div>

      {crops.length === 0 ? (
        <p className="text-gray-500 italic mt-4">
          No products found for this farm.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-xl shadow border border-[#e0e6dc] p-4 hover:shadow-md transition-all"
            >
              <img
                src={crop.image}
                alt={crop.name}
                className="w-full h-36 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-[#3e5e40] text-lg">
                {crop.name}
              </h3>
              <p className="text-gray-600 text-sm">{crop.type}</p>
              <p className="text-[#678a66] text-sm font-medium mb-2">
                {crop.price} SAR/kg
              </p>
              <p className="text-sm text-gray-700">
                <strong>City:</strong> {crop.region || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Contact:</strong> {crop.contact || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}