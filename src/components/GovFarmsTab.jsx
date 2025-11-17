import React from "react";

export default function GovFarmsTab({ farmers, crops }) {
  const cropsByFarmer = crops.reduce((acc, c) => {
    if (!c.farmerId) return acc;
    acc[c.farmerId] = (acc[c.farmerId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Farms Overview
      </h2>

      {farmers.length === 0 ? (
        <p className="text-gray-500 italic">No farms found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Farmer</th>
              <th className="p-2">Farm Name</th>
              <th className="p-2">City</th>
              <th className="p-2">Crops Count</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((f) => (
              <tr key={f.id} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{f.name}</td>
                <td className="p-2">{f.farmName}</td>
                <td className="p-2">{f.city}</td>
                <td className="p-2">
                  {cropsByFarmer[f.id] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
