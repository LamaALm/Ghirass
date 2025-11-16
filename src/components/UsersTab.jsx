import React from "react";

export default function UsersTab({ users }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registered Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-500 italic">No users found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Username</th>
              <th className="p-2">City</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
