import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState({ totalFarmers: 0, totalCrops: 0, topCity: "-" });
  const [chartData, setChartData] = useState([]);

  // Fetch farmers and crops
  useEffect(() => {
    Promise.all([
      fetch("https://ghirass-api.onrender.com/farmers").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/crops").then((res) => res.json()),
    ])
      .then(([farmersData, cropsData]) => {
        setFarmers(farmersData);
        setCrops(cropsData);
        const cities = {};
        cropsData.forEach((crop) => {
          const city = crop.region || "Unknown";
          cities[city] = (cities[city] || 0) + 1;
        });
        const sortedCities = Object.entries(cities).sort((a, b) => b[1] - a[1]);
        setStats({
          totalFarmers: farmersData.length,
          totalCrops: cropsData.length,
          topCity: sortedCities.length ? sortedCities[0][0] : "-",
        });
        setChartData(Object.entries(cities).map(([city, count]) => ({ city, count })));
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6 transition-all duration-300">
      <h1 className="text-3xl font-semibold text-[#3e5e40]">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3">
        {["overview", "farmers", "crops"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-[#8fae8d] text-white"
                : "bg-[#e6ece5] text-[#3e5e40] hover:bg-[#dfe5dc]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] text-center">
              <h3 className="text-gray-600 text-sm">Total Farmers</h3>
              <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalFarmers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] text-center">
              <h3 className="text-gray-600 text-sm">Total Crops</h3>
              <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalCrops}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] text-center">
              <h3 className="text-gray-600 text-sm">Top City</h3>
              <p className="text-2xl font-semibold text-[#3e5e40]">{stats.topCity}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Crop Distribution by City
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8fae8d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 italic">No data available.</p>
            )}
          </div>
        </div>
      )}

      {/* Farmers */}
      {activeTab === "farmers" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Farmers</h2>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Farm Name</th>
                <th className="p-2">City</th>
                <th className="p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((f) => (
                <tr key={f.id} className="border-b hover:bg-[#f6f7f3]">
                  <td className="p-2">{f.name}</td>
                  <td className="p-2">{f.farmName || "-"}</td>
                  <td className="p-2">{f.city}</td>
                  <td className="p-2">{f.contact || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Crops */}
      {activeTab === "crops" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crops</h2>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Price</th>
                <th className="p-2">Farmer</th>
                <th className="p-2">Region</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c.id} className="border-b hover:bg-[#f6f7f3]">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.type}</td>
                  <td className="p-2">{c.price} SAR</td>
                  <td className="p-2">{c.farmer || "-"}</td>
                  <td className="p-2">{c.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
