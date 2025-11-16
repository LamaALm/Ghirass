import React from "react";

export default function MaintenanceTab() {
  const handleBackup = () => {
    alert("Backup started (simulated).");
  };

  const handleRestore = () => {
    alert("Restore process triggered (simulated).");
  };

  const handleIntegrityCheck = () => {
    alert("Integrity check completed.");
  };

  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Maintenance Tools</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-[#f9faf8] p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="font-semibold text-[#3e5e40] mb-2">Backup</h3>
          <p className="text-gray-600 text-sm mb-3">
            Create a snapshot of the database.
          </p>
          <button
            onClick={handleBackup}
            className="bg-[#8FAE8D] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg text-sm"
          >
            Run Backup
          </button>
        </div>

        <div className="bg-[#f9faf8] p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="font-semibold text-[#3e5e40] mb-2">Restore</h3>
          <p className="text-gray-600 text-sm mb-3">
            Restore a previous backup.
          </p>
          <button
            onClick={handleRestore}
            className="bg-[#e0b28e] hover:bg-[#d79d70] text-white px-4 py-2 rounded-lg text-sm"
          >
            Run Restore
          </button>
        </div>

        <div className="bg-[#f9faf8] p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="font-semibold text-[#3e5e40] mb-2">Integrity Check</h3>
          <p className="text-gray-600 text-sm mb-3">
            Verify database consistency.
          </p>
          <button
            onClick={handleIntegrityCheck}
            className="bg-[#8f9fae] hover:bg-[#7b8a98] text-white px-4 py-2 rounded-lg text-sm"
          >
            Run Check
          </button>
        </div>

      </div>
    </div>
  );
}
