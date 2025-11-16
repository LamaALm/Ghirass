import React, { useState, useEffect } from "react";
import { writeLog } from "./utils/logger";
import {
  Users,
  Home,
  Leaf,
  Database,
  ListTree,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logLevelFilter, setLogLevelFilter] = useState("All");

  // Fetch data from API
  useEffect(() => {
    Promise.all([
      fetch("https://ghirass-api.onrender.com/farmers").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/crops").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/users").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/logs").then((res) => res.json()),
    ])
      .then(([farmersData, cropsData, usersData, logsData]) => {
        setFarmers(farmersData);
        setCrops(cropsData);
        setUsers(usersData);
        setLogs(logsData);
      })
      .catch((err) => console.error("Error fetching admin data:", err));
  }, []);

  // Filter Logs
  const filteredLogs =
    logLevelFilter === "All"
      ? logs
      : logs.filter((log) => log.level === logLevelFilter);

  // Admin Maintenance actions
  const handleBackup = () => {
    writeLog("Admin triggered BACKUP", "Info", "Admin");
    alert("Backup started successfully (simulated).");
  };

  const handleRestore = () => {
    writeLog("Admin triggered RESTORE", "Warning", "Admin");
    alert("System restore initialized (simulated).");
  };

  const handleIntegrityCheck = () => {
    writeLog("Admin ran INTEGRITY CHECK", "Info", "Admin");
    alert("Integrity check completed — no issues detected.");
  };

  // Tabs with icons
  const tabs = [
    { id: "overview", label: "Overview", icon: <Home size={16} /> },
    { id: "farmers", label: "Farmers", icon: <Leaf size={16} /> },
    { id: "crops", label: "Crops", icon: <ListTree size={16} /> },
    { id: "users", label: "Users", icon: <Users size={16} /> },
    { id: "logs", label: "Security Logs", icon: <AlertTriangle size={16} /> },
    { id: "maintenance", label: "Maintenance", icon: <Settings size={16} /> },
  ];

  // Count crops per city
const cityCounts = crops.reduce((acc, crop) => {
  acc[crop.region] = (acc[crop.region] || 0) + 1;
  return acc;
}, {});

const barChartData = Object.entries(cityCounts).map(([city, count]) => ({
  city,
  count,
}));

// Count crop types (Vegetable/Fruit)
const typeCounts = crops.reduce((acc, crop) => {
  acc[crop.type] = (acc[crop.type] || 0) + 1;
  return acc;
}, {});

const pieChartData = Object.entries(typeCounts).map(([type, count]) => ({
  name: type,
  value: count,
}));


  return (
    <div className="w-full px-10 mt-10 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#3e5e40]">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage system data, monitor logs, and perform administrative maintenance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-xl shadow border border-[#e0e6dc] w-fit gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition text-sm ${
              activeTab === tab.id
                ? "bg-[#8fae8d] text-white shadow-sm"
                : "bg-[#eef3ec] text-[#3e5e40] hover:bg-[#e0e7df]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
{activeTab === "overview" && (
  <div className="space-y-8">

    {/* Stats Boxes */}
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">

      {/* Total Farmers */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] text-center">
        <h3 className="text-sm text-gray-600 mb-1">Total Farmers</h3>
        <p className="text-3xl font-bold text-[#3e5e40]">{farmers.length}</p>
      </div>

      {/* Total Crops */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] text-center">
        <h3 className="text-sm text-gray-600 mb-1">Total Crops Listed</h3>
        <p className="text-3xl font-bold text-[#3e5e40]">{crops.length}</p>
      </div>

      {/* Top City */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] text-center">
        <h3 className="text-sm text-gray-600 mb-1">Top City</h3>
        <p className="text-2xl font-semibold text-[#3e5e40]">
          {barChartData.length ? barChartData[0].city : "—"}
        </p>
      </div>

      {/* System Users */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] text-center">
        <h3 className="text-sm text-gray-600 mb-1">System Users</h3>
        <p className="text-3xl font-bold text-[#3e5e40]">{users.length}</p>
      </div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* City Distribution Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Crop Distribution by City
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8fae8d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Crop Type Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Crop Type Distribution
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={90}
              fill="#8fae8d"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>
)}


      {/* Farmers Table */}
      {activeTab === "farmers" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Farmers</h2>
          <table className="w-full border-collapse text-left text-sm bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-[#eef3ec] text-[#3e5e40]">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">City</th>
                <th className="p-3">Contact</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer) => (
                <tr key={farmer.id} className="border-t hover:bg-[#f6f7f3] transition">
                  <td className="p-3">{farmer.name}</td>
                  <td className="p-3">{farmer.city}</td>
                  <td className="p-3">{farmer.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Crops Table */}
      {activeTab === "crops" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Crops</h2>
          <table className="w-full border-collapse text-left text-sm bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-[#eef3ec] text-[#3e5e40]">
              <tr>
                <th className="p-3">Crop</th>
                <th className="p-3">Type</th>
                <th className="p-3">Farmer</th>
                <th className="p-3">City</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id} className="border-t hover:bg-[#f6f7f3] transition">
                  <td className="p-3">{crop.name}</td>
                  <td className="p-3">{crop.type}</td>
                  <td className="p-3">{crop.farmer}</td>
                  <td className="p-3">{crop.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Users</h2>
          <table className="w-full border-collapse text-left text-sm bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-[#eef3ec] text-[#3e5e40]">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-[#f6f7f3] transition">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Security Logs */}
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
            <table className="w-full border-collapse text-left text-sm bg-white rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-[#eef3ec] text-[#3e5e40]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-[#f6f7f3] transition">
                    <td className="p-3">{log.time}</td>
                    <td className="p-3">{log.user}</td>
                    <td className="p-3">{log.action}</td>
                    <td
                      className={`p-3 font-medium ${
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

      {/* Maintenance */}
      {activeTab === "maintenance" && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc] space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">System Maintenance</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Backup */}
            <div className="border border-[#e0e6dc] rounded-xl p-5 bg-[#f9faf8]">
              <h3 className="font-semibold text-[#3e5e40] mb-2">Backup Database</h3>
              <p className="text-sm text-gray-600 mb-3">
                Creates a snapshot of the database (simulated).
              </p>
              <button
                onClick={handleBackup}
                className="bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg text-sm"
              >
                Run Backup
              </button>
            </div>

            {/* Restore */}
            <div className="border border-[#e0e6dc] rounded-xl p-5 bg-[#f9faf8]">
              <h3 className="font-semibold text-[#3e5e40] mb-2">Restore Backup</h3>
              <p className="text-sm text-gray-600 mb-3">
                Restores the last backup snapshot (simulated).
              </p>
              <button
                onClick={handleRestore}
                className="bg-[#e0b28e] hover:bg-[#d79d70] text-white px-4 py-2 rounded-lg text-sm"
              >
                Restore
              </button>
            </div>

            {/* Integrity */}
            <div className="border border-[#e0e6dc] rounded-xl p-5 bg-[#f9faf8]">
              <h3 className="font-semibold text-[#3e5e40] mb-2">Integrity Check</h3>
              <p className="text-sm text-gray-600 mb-3">
                Validates system data consistency (simulated).
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
      )}

    </div>
  );
}
