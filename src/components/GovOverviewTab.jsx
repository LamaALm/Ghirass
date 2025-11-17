import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function GovOverviewTab({ farmers, crops, licenses }) {
  // Stats
  const totalLicensedFarmers = licenses.length;
  const totalFarms = farmers.length;
  const totalCrops = crops.length;

  const citiesSet = new Set(farmers.map((f) => f.city));
  const totalCities = citiesSet.size;

  // Farms per city
  const farmsByCityMap = farmers.reduce((acc, f) => {
    const city = f.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const farmsByCity = Object.entries(farmsByCityMap).map(([city, count]) => ({
    city,
    farms: count,
  }));

  const leadingCity =
    farmsByCity.length > 0
      ? [...farmsByCity].sort((a, b) => b.farms - a.farms)[0].city
      : "-";

  // Crop type distribution
  const cropsByType = [
    {
      type: "Vegetable",
      value: crops.filter((c) => c.type === "Vegetable").length,
    },
    {
      type: "Fruit",
      value: crops.filter((c) => c.type === "Fruit").length,
    },
  ];

  // Top crops by name
  const cropNameMap = crops.reduce((acc, c) => {
    const name = c.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const topCrops = Object.entries(cropNameMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Fake growth data (for visual analytics)
  const growthData = [
    { month: "Jan", farms: 2 },
    { month: "Feb", farms: 3 },
    { month: "Mar", farms: 4 },
    { month: "Apr", farms: 5 },
    { month: "May", farms: 6 },
    { month: "Jun", farms: 7 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600 text-sm">Licensed Farmers</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">
            {totalLicensedFarmers}
          </p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600 text-sm">Total Farms</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">{totalFarms}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600 text-sm">Total Crops</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">{totalCrops}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600 text-sm">Cities Covered</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">
            {totalCities}
          </p>
        </div>
      </div>

      {/* Charts 2 x 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farms per city */}
        <div className="bg-white shadow rounded-xl border border-[#e0e6dc] p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Farms per City
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={farmsByCity}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="farms" fill="#8FAE8D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-2">
            Leading city: <span className="font-semibold">{leadingCity}</span>
          </p>
        </div>

        {/* Crop types */}
        <div className="bg-white shadow rounded-xl border border-[#e0e6dc] p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Crop Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={cropsByType}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value, percent }) =>
                  `${name} ${Math.round(percent * 100)}% (${value})`
                }
              >
                <Cell fill="#8FAE8D" />
                <Cell fill="#B7C9A9" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top crops */}
        <div className="bg-white shadow rounded-xl border border-[#e0e6dc] p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Top Crops
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCrops}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#B7C9A9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth of farms over time */}
        <div className="bg-white shadow rounded-xl border border-[#e0e6dc] p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Farm Registration Trend (Sample)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="farms"
                stroke="#8FAE8D"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
