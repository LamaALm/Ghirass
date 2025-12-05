import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./Ghirass-Logo.png";

export default function BuyerDashboard() {
  const navigate = useNavigate();

  // المشتري الحالي من localStorage (بعد الـ login)
  const buyerInfo = JSON.parse(localStorage.getItem("buyerData"));

  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);

  // هنا ما نخزن كل الكروبس، بس السجلات من جدول /favorites
  // مثال: [{ id, buyerId, cropId }]
  const [favorites, setFavorites] = useState([]);

  const [selectedType, setSelectedType] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);

  // لو واحد حاول يدخل بدون login
  useEffect(() => {
    if (!buyerInfo) {
      navigate("/buyer-login");
    }
  }, [buyerInfo, navigate]);

  // =========================
  // Fetch crops من السيرفر
  // =========================
  useEffect(() => {
    fetch("https://ghirass-api.onrender.com/crops")
      .then((res) => res.json())
      .then((data) => {
        setCrops(data);
        setFilteredCrops(data);
      })
      .catch((err) => console.error("Error fetching crops:", err));
  }, []);

  // =========================
  // Fetch favorites للمشتري الحالي فقط
  // =========================
  const fetchFavorites = () => {
    if (!buyerInfo?.id) return;

    fetch(
      `https://ghirass-api.onrender.com/favorites?buyerId=${buyerInfo.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data); // كل عنصر: { id, buyerId, cropId }
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  };

  useEffect(() => {
    fetchFavorites();
  }, [buyerInfo]);

  // Cities (Eastern Province)
  const cities = [
    "All",
    "Dammam",
    "Dhahran",
    "Al Khobar",
    "Jubail",
    "Ras Tanura",
    "Abqaiq",
    "Al Ahsa",
  ];

  // =========================
  // Handle filters
  // =========================
  const handleFilter = (type, city, search) => {
    let filtered = crops;

    if (type && type !== "All") {
      filtered = filtered.filter(
        (crop) => crop.type.toLowerCase() === type.toLowerCase()
      );
    }

    if (city && city !== "All") {
      filtered = filtered.filter(
        (crop) => crop.region?.toLowerCase() === city.toLowerCase()
      );
    }

    if (search && search.trim() !== "") {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (crop) =>
          crop.name.toLowerCase().includes(term) ||
          crop.type.toLowerCase().includes(term)
      );
    }

    setFilteredCrops(filtered);
  };

  // إعادة تطبيق الفلترة كل ما تغير شيء
  useEffect(() => {
    handleFilter(selectedType, selectedCity, searchTerm);
  }, [selectedType, selectedCity, searchTerm, crops]);

  // =========================
  // Helpers للفيفوريت
  // =========================

  // هل هذا الـ crop مضاف كمفضلة لهذا المشتري؟
  const isFavorite = (cropId) =>
    favorites.some((fav) => fav.cropId === cropId);

  // إضافة / إزالة من المفضلة
  const toggleFavorite = (crop) => {
    if (!buyerInfo?.id) {
      alert("Please log in as a buyer first.");
      return;
    }

    const existingFav = favorites.find((fav) => fav.cropId === crop.id);

    if (existingFav) {
      // حذف من /favorites
      fetch(
        `https://ghirass-api.onrender.com/favorites/${existingFav.id}`,
        {
          method: "DELETE",
        }
      )
        .then(() => {
          // تحديث state محلي
          setFavorites((prev) =>
            prev.filter((fav) => fav.id !== existingFav.id)
          );
        })
        .catch((err) =>
          console.error("Error removing favorite:", err)
        );
    } else {
      // إضافة جديدة
      fetch("https://ghirass-api.onrender.com/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: buyerInfo.id,
          cropId: crop.id,
          addedAt: new Date().toISOString(),
        }),
      })
        .then((res) => res.json())
        .then((newFav) => {
          setFavorites((prev) => [...prev, newFav]);
        })
        .catch((err) =>
          console.error("Error adding favorite:", err)
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6 transition-all duration-300">
      {/* Header Row — Title (left) + Logo (right) */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[#3e5e40]">
          Buyer Dashboard
        </h1>

        <img
          src={logo}
          alt="Ghirass Logo"
          className="h-20 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/")}
        />
      </div>

      <p className="text-gray-600 mb-6">
        Explore fresh crops directly from local farmers 🌿
      </p>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] flex flex-wrap items-center justify-between">
        {/* Left Section: Search + Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Box */}
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Type:
            </label>
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d] w-48"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
            >
              <option value="All">All</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              City:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSelectedType("All");
              setSelectedCity("All");
              setSearchTerm("");
            }}
            className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg transition-all"
          >
            Reset Filters
          </button>
        </div>

        {/* Right Section: Go to Favorites */}
        <div>
          <button
            onClick={() => navigate("/favorites")}
            className="text-[#3e5e40] hover:underline text-sm"
          >
            Go to Favorites →
          </button>
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <p className="text-gray-500 italic mt-6">No crops found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-xl shadow border border-[#e0e6dc] p-4 hover:shadow-md transition-all relative"
            >
              {/* Favorite button */}
              <button
                onClick={() => toggleFavorite(crop)}
                className={`absolute top-2 right-2 text-lg ${
                  isFavorite(crop.id)
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-400"
                }`}
              >
                {isFavorite(crop.id) ? "♥" : "♡"}
              </button>

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

              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <p>
                  <strong>Farmer:</strong> {crop.farmer || "Unknown"}
                </p>
                {crop.farmName && (
                  <p>
                    <strong>Farm:</strong> {crop.farmName}
                  </p>
                )}
                <p>
                  <strong>City:</strong> {crop.region || "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedSeller(crop)}
                  className="bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg text-sm"
                >
                  View Seller Info
                </button>

                <button
                  onClick={() => navigate(`/farm/${crop.farmer}`)}
                  className="border border-[#8fae8d] text-[#3e5e40] hover:bg-[#e6ece5] py-2 rounded-lg text-sm"
                >
                  View Farm Products
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Seller Info */}
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
  );
}