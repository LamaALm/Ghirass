import React from "react";

export default function GovLicensesTab({ licenses }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Farmer Licenses
      </h2>

      {licenses.length === 0 ? (
        <p className="text-gray-500 italic">No licenses found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">License #</th>
              <th className="p-2">Farmer</th>
              <th className="p-2">Farm Name</th>
              <th className="p-2">City</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((lic) => (
              <tr key={lic.id || lic.licenseNumber} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{lic.licenseNumber}</td>
                <td className="p-2">{lic.farmerName}</td>
                <td className="p-2">{lic.farmName}</td>
                <td className="p-2">{lic.city}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      lic.status === "Valid"
                        ? "bg-green-100 text-green-700"
                        : lic.status === "Expired"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lic.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
