import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FarmPage() {
  const { farmer } = useParams();
  const navigate = useNavigate();
  const [farmerCrops, setFarmerCrops] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/crops")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((crop) => crop.farmer === farmer);
        setFarmerCrops(filtered);
      })
      .catch((err) => console.error("Error fetching crops:", err));
  }, [farmer]);

  return (
    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#3e5e40]">
          {farmer}'s Farm
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg transition-all"
        >
          ← Back
        </button>
      </div>

      {farmerCrops.length === 0 ? (
        <p className="text-gray-500 italic">No crops found for this farm.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {farmerCrops.map((crop) => (
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
                <strong>City:</strong> {crop.region}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
