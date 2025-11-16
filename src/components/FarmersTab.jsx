import React from "react";

export default function FarmersTab({ farmers }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Farmers</h2>

      {farmers.length === 0 ? (
        <p className="text-gray-500 italic">No farmers found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Farm Name</th>
              <th className="p-2">City</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Username</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((f) => (
              <tr key={f.id} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{f.name}</td>
                <td className="p-2">{f.farmName}</td>
                <td className="p-2">{f.city}</td>
                <td className="p-2">{f.contact}</td>
                <td className="p-2">{f.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
