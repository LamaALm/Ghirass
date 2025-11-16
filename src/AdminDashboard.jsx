import React, { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import OverviewTab from "./components/OverviewTab";
import FarmersTab from "./components/FarmersTab";
import CropsTab from "./components/CropsTab";
import UsersTab from "./components/UsersTab";
import LogsTab from "./components/LogsTab";
import MaintenanceTab from "./components/MaintenanceTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // ====== State ======
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  // Fetch security logs from backend (REAL logs)
useEffect(() => {
  fetch("https://ghirass-api.onrender.com/logs")
    .then((res) => res.json())
    .then((data) => setLogs(data))
    .catch((err) => console.error("Error fetching logs:", err));
}, []);


  // ====== Fetch Farmers & Crops ======
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

  // ====== Stats ======
  const stats = {
    totalFarmers: farmers.length,
    totalCrops: crops.length,
    totalUsers: users.length,
    topCity:
      crops.length > 0
        ? Object.entries(
            crops.reduce((acc, crop) => {
              acc[crop.region] = (acc[crop.region] || 0) + 1;
              return acc;
            }, {})
          ).sort((a, b) => b[1] - a[1])[0][0]
        : "-",
  };

  // ====== Bar Chart: City Distribution ======
  const chartData = Object.entries(
    crops.reduce((acc, crop) => {
      acc[crop.region] = (acc[crop.region] || 0) + 1;
      return acc;
    }, {})
  ).map(([city, count]) => ({ city, count }));

  // ====== Pie Chart: Crop Types ======
  const pieChartData = [
    {
      type: "Vegetable",
      value: crops.filter((c) => c.type === "Vegetable").length,
    },
    {
      type: "Fruit",
      value: crops.filter((c) => c.type === "Fruit").length,
    },
  ];

  // ====== Filter Logs by Level ======
  const filteredLogs = logs.sort((a, b) => b.id - a.id);

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#f6f7f3] min-h-screen">
        <h1 className="text-3xl font-semibold text-[#3e5e40] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Manage system data, monitor logs, and perform administrative maintenance.
        </p>

        {/* TAB CONTENT */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            chartData={chartData}
            pieChartData={pieChartData}
          />
        )}

        {activeTab === "farmers" && <FarmersTab farmers={farmers} />}

        {activeTab === "crops" && <CropsTab crops={crops} />}

        {activeTab === "users" && <UsersTab users={users} />}

        {activeTab === "logs" && <LogsTab logs={filteredLogs} />}

        {activeTab === "maintenance" && <MaintenanceTab />}
      </div>
    </div>
  );
}
