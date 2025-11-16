import React from "react";

export default function LogsTab({ logs }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Logs</h2>

      {logs.length === 0 ? (
        <p className="text-gray-500 italic">No logs found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Time</th>
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
              <th className="p-2">Level</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{log.time}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{log.action}</td>
                <td className={`p-2 font-medium ${
                  log.level === "Error"
                    ? "text-red-600"
                    : log.level === "Warning"
                    ? "text-yellow-700"
                    : "text-gray-700"
                }`}>
                  {log.level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
