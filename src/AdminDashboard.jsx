import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState({ totalFarmers: 0, totalCrops: 0, topCity: "-" });
  const [chartData, setChartData] = useState([]);
  // USER MANAGEMENT STATES
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    city: "",
    contact: ""
  });

  const [logs, setLogs] = useState([]);
  const [logLevelFilter, setLogLevelFilter] = useState("All");

  // Fetch logs from API
  useEffect(() => {
    fetch("https://ghirass-api.onrender.com/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);


  // Fetch farmers and crops
  useEffect(() => {
    Promise.all([
      fetch("https://ghirass-api.onrender.com/farmers").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/crops").then((res) => res.json()),
    ])
      .then(([farmersData, cropsData]) => {
        setFarmers(farmersData);
        setCrops(cropsData);
        const cities = {};
        cropsData.forEach((crop) => {
          const city = crop.region || "Unknown";
          cities[city] = (cities[city] || 0) + 1;
        });
        const sortedCities = Object.entries(cities).sort((a, b) => b[1] - a[1]);
        setStats({
          totalFarmers: farmersData.length,
          totalCrops: cropsData.length,
          topCity: sortedCities.length ? sortedCities[0][0] : "-",
        });
        setChartData(Object.entries(cities).map(([city, count]) => ({ city, count })));
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    fetch("https://ghirass-api.onrender.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleAddUser = (e) => {
  e.preventDefault();

  fetch("https://ghirass-api.onrender.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...userForm, id: crypto.randomUUID() })
  })
    .then(() => {
      setShowUserModal(false);
      window.location.reload();
    })
    .catch((err) => console.error("Error adding user:", err));
};


const handleUpdateUser = (e) => {
  e.preventDefault();

  fetch(`https://ghirass-api.onrender.com/users/${editUser.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userForm)
  })
    .then(() => {
      setShowUserModal(false);
      window.location.reload();
    })
    .catch((err) => console.error("Error updating user:", err));
};

const handleDeleteUser = (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  fetch(`https://ghirass-api.onrender.com/users/${id}`, {
    method: "DELETE"
  })
    .then(() => window.location.reload())
    .catch((err) => console.error("Error deleting user:", err));
};

const filteredLogs =
  logLevelFilter === "All"
    ? logs
    : logs.filter((log) => log.level === logLevelFilter);


  return (
    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6 transition-all duration-300">
      <h1 className="text-3xl font-semibold text-[#3e5e40]">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3">
        {["overview", "farmers", "crops", "users", "logs", "maintenance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-[#8fae8d] text-white"
                : "bg-[#e6ece5] text-[#3e5e40] hover:bg-[#dfe5dc]"
            }`}
          >
            {tab === "logs"
            ? "Security Logs"
            : tab === "maintenance"
            ? "Maintenance"
            : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] text-center">
              <h3 className="text-gray-600 text-sm">Total Farmers</h3>
              <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalFarmers}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] text-center">
              <h3 className="text-gray-600 text-sm">Total Crops</h3>
              <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalCrops}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] text-center">
              <h3 className="text-gray-600 text-sm">Top City</h3>
              <p className="text-2xl font-semibold text-[#3e5e40]">{stats.topCity}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Crop Distribution by City
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8fae8d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 italic">No data available.</p>
            )}
          </div>
        </div>
      )}

      {/* Farmers */}
      {activeTab === "farmers" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Farmers</h2>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Farm Name</th>
                <th className="p-2">City</th>
                <th className="p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((f) => (
                <tr key={f.id} className="border-b hover:bg-[#f6f7f3]">
                  <td className="p-2">{f.name}</td>
                  <td className="p-2">{f.farmName || "-"}</td>
                  <td className="p-2">{f.city}</td>
                  <td className="p-2">{f.contact || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Crops */}
      {activeTab === "crops" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crops</h2>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Price</th>
                <th className="p-2">Farmer</th>
                <th className="p-2">Region</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c.id} className="border-b hover:bg-[#f6f7f3]">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.type}</td>
                  <td className="p-2">{c.price} SAR</td>
                  <td className="p-2">{c.farmer || "-"}</td>
                  <td className="p-2">{c.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== USER MANAGEMENT TAB ===================== */}
{activeTab === "users" && (
  <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
      <button
        onClick={() => {
          setEditUser(null);
          setShowUserModal(true);
        }}
        className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg"
      >
        + Add User
      </button>
    </div>

    {/* USERS TABLE */}
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="p-2">Name</th>
          <th className="p-2">Username</th>
          <th className="p-2">Role</th>
          <th className="p-2">City</th>
          <th className="p-2">Contact</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b hover:bg-[#f6f7f3]">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.username}</td>
            <td className="p-2">{u.role}</td>
            <td className="p-2">{u.city}</td>
            <td className="p-2">{u.contact}</td>
            <td className="p-2 flex gap-3">
              <button
                onClick={() => {
                  setEditUser(u);
                  setShowUserModal(true);
                }}
                className="text-blue-700 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(u.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* USER MODAL */}
    {showUserModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-96 shadow">

          <h3 className="text-lg font-semibold mb-4 text-[#3e5e40]">
            {editUser ? "Edit User" : "Add New User"}
          </h3>

          <form
            onSubmit={editUser ? handleUpdateUser : handleAddUser}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={userForm.username}
              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />

            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              className="border p-2 rounded w-full bg-white"
              required
            >
              <option value="">Select Role</option>
              <option value="Farmer">Farmer</option>
              <option value="Buyer">Buyer</option>
              <option value="Admin">Admin</option>
              <option value="Government">Government</option>
            </select>

            <input
              type="text"
              placeholder="City"
              value={userForm.city}
              onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <input
              type="text"
              placeholder="Contact"
              value={userForm.contact}
              onChange={(e) => setUserForm({ ...userForm, contact: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    
  </div>
)}

{activeTab === "logs" && (
  <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Security Logs
      </h2>

      <select
        value={logLevelFilter}
        onChange={(e) => setLogLevelFilter(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-white text-sm"
      >
        <option value="All">All Levels</option>
        <option value="Info">Info</option>
        <option value="Warning">Warning</option>
        <option value="Error">Error</option>
      </select>
    </div>

    {filteredLogs.length === 0 ? (
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
          {filteredLogs.map((log) => (
            <tr key={log.id} className="border-b hover:bg-[#f6f7f3]">
              <td className="p-2">{log.time}</td>
              <td className="p-2">{log.user}</td>
              <td className="p-2">{log.action}</td>
              <td
                className={`p-2 font-medium ${
                  log.level === "Error"
                    ? "text-red-600"
                    : log.level === "Warning"
                    ? "text-yellow-700"
                    : "text-gray-700"
                }`}
              >
                {log.level}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


    </div>
  );
}
