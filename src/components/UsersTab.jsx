import React, { useState } from "react";
import { writeLog } from "../utils/logger";

export default function UsersTab({ users, setUsers, fetchUsers }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ============================
  // DELETE USER
  // ============================
const handleDeleteUser = async (user) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    // Step 1: delete from /users
    await fetch(`https://ghirass-api.onrender.com/users/${user.id}`, {
      method: "DELETE",
    });

    // Step 2: if the user is a farmer → delete also from /farmers
    if (user.role === "Farmer") {
      const farmerMatch = await fetch(
        `https://ghirass-api.onrender.com/farmers?username=${user.username}`
      ).then((res) => res.json());

      if (farmerMatch.length > 0) {
        await fetch(
          `https://ghirass-api.onrender.com/farmers/${farmerMatch[0].id}`,
          { method: "DELETE" }
        );
      }
    }

    alert("User deleted successfully.");
    fetchUsers();

  } catch (err) {
    console.error("Error deleting user:", err);
  }
};


  // ============================
  // UPDATE USER
  // ============================
  const handleUpdateUser = () => {
    fetch(`https://ghirass-api.onrender.com/users/${editingUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editingUser.role }),
    })
      .then(() => {
        alert("User updated successfully!");
        writeLog(
          "Admin",
          `Updated user role: ${editingUser.username} → ${editingUser.role}`,
          "Info"
        );

        setShowEditModal(false);

        // refresh UI
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, role: editingUser.role } : u
          )
        );
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  return (
    <div className="bg-white rounded-xl shadow border border-[#e0e6dc] p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">System Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-500 italic">No users found.</p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-[#f6f7f3]">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.role}</td>

                <td className="p-2 flex gap-3">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setShowEditModal(true);
                    }}
                    className="text-blue-700 hover:underline"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDeleteUser(u)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">

            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit User Role
            </h3>

            <label className="text-sm text-gray-700">Role</label>
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              className="w-full border rounded-lg p-2 bg-white mt-1"
            >
              <option value="Admin">Admin</option>
              <option value="Farmer">Farmer</option>
              <option value="Buyer">Buyer</option>
            </select>

            <button
              onClick={handleUpdateUser}
              className="mt-4 w-full bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

