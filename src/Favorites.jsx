import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./Ghirass-Logo.png";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

useEffect(() => {
  const stored = localStorage.getItem("buyerData");
  if (stored) {
    setBuyerInfo(JSON.parse(stored));
  }
}, []);

useEffect(() => {
  if (!buyerInfo || !buyerInfo.username) return;

  const key = `favorites_${buyerInfo.username}`;
  const saved = JSON.parse(localStorage.getItem(key)) || [];

  const favoriteIds = saved.map((item) => item.id);

  if (favoriteIds.length === 0) {
    setFavorites([]);
    return;
  }

  fetch("https://ghirass-api.onrender.com/crops")
    .then((res) => res.json())
    .then((allCrops) => {
      const updatedFavorites = allCrops.filter((crop) =>
        favoriteIds.includes(crop.id)
      );
      setFavorites(updatedFavorites);
    })
    .catch((err) => console.error("Error loading favorites:", err));
}, [buyerInfo]);

  return (
    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6">
      {/* Header Row — Title + Logo + Back */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-[#3e5e40]">
            My Favorites
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Ghirass Logo"
            className="h-16 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate("/")}
          />
          <button
            onClick={() => navigate(-1)}
            className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg transition-all"
          >
            ← Back
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <p className="text-gray-500 italic mt-6">
          You haven’t added any favorites yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4 mt-4">
          {favorites.map((crop) => (

  <div
    key={crop.id}
    className="bg-white w-[260px] h-[430px] rounded-xl shadow border border-[#e0e6dc] p-4 hover:shadow-md transition-all flex flex-col justify-between"
  >
   

    {/* Image */}
    <img
      src={crop.image}
      alt={crop.name}
      className="w-full h-40 object-cover rounded-lg mb-3"
    />

    {/* Crop Info */}
    <h3 className="font-semibold text-[#3e5e40] text-lg">{crop.name}</h3>
    <p className="text-gray-600 text-sm">{crop.type}</p>
    <p className="text-[#678a66] text-sm font-medium mb-2">
      {crop.price} SAR/kg
    </p>

    <div className="text-sm text-gray-700 space-y-1 mb-3">
      <p>
        <strong>Farmer:</strong> {crop.farmer}
      </p>
      {crop.farmName && (
        <p>
          <strong>Farm:</strong> {crop.farmName}
        </p>
      )}
      <p>
        <strong>City:</strong> {crop.region}
      </p>
    </div>

    {/* Buttons (same style as dashboard) */}
    <div className="flex flex-col gap-2">
      <button
      onClick={() => setSelectedSeller(crop)}
        className="bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg text-sm"
      >
        View Seller Info
      </button>

  
    </div>
  </div>
          ))}

          {selectedSeller && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative border border-[#e0e6dc]">
      <button
        onClick={() => setSelectedSeller(null)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold text-[#3e5e40] mb-4">
        Seller Information
      </h2>

      <p className="text-gray-700">
        <strong>Farmer:</strong> {selectedSeller.farmer}
      </p>
      <p className="text-gray-700">
        <strong>Farm:</strong> {selectedSeller.farmName || "N/A"}
      </p>
      <p className="text-gray-700">
        <strong>City:</strong> {selectedSeller.region || "N/A"}
      </p>
      <p className="text-gray-700">
        <strong>Contact:</strong> {selectedSeller.contact || "N/A"}
      </p>

      <div className="mt-5 flex justify-center">
        <button
          onClick={() => setSelectedSeller(null)}
          className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
        </div>
        
      )}
    </div>
    
  );
}