import React from "react";

export default function CropsTab({ crops }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Crops</h2>

      {crops.length === 0 ? (
        <p className="text-gray-500 italic">No crops found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Price</th>
              <th className="p-2">Region</th>
              <th className="p-2">Farmer</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c.id} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.type}</td>
                <td className="p-2">{c.price} SAR</td>
                <td className="p-2">{c.region}</td>
                <td className="p-2">{c.farmer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
