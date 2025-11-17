import React from "react";

export default function GovReportsTab({ farmers, crops }) {
  const farmsByCity = farmers.reduce((acc, f) => {
    const city = f.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(farmsByCity)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const cropNameMap = crops.reduce((acc, c) => {
    const name = c.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const topCrops = Object.entries(cropNameMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Summary Reports
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-[#3e5e40] mb-2">
            Top Cities by Farm Count
          </h3>
          {topCities.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {topCities.map((c) => (
                <li key={c.city}>
                  <span className="font-medium">{c.city}:</span> {c.count} farms
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-[#3e5e40] mb-2">
            Top Crops by Availability
          </h3>
          {topCrops.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {topCrops.map((c) => (
                <li key={c.name}>
                  <span className="font-medium">{c.name}:</span> {c.count} listings
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-gray-500 text-xs">
        These reports help the ministry understand regional distribution of farms and crops,
        and support strategic planning for green initiatives.
      </p>
    </div>
  );
}
