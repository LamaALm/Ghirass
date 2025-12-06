import React, { useState, useEffect } from "react";
import GovSidebar from "./components/GovSidebar";
import GovOverviewTab from "./components/GovOverviewTab";
import GovLicensesTab from "./components/GovLicensesTab";
import GovFarmsTab from "./components/GovFarmsTab";
import GovReportsTab from "./components/GovReportsTab";
import { useNavigate } from "react-router-dom";
import logo from "./Ghirass-Logo.png";

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const [licenses, setLicenses] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  
  const handleLogout = () => {
  localStorage.removeItem("farmerData");
  window.location.href = "/"; 
};

  useEffect(() => {
    Promise.all([
      fetch("https://ghirass-api.onrender.com/licenses").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/farmers").then((res) => res.json()),
      fetch("https://ghirass-api.onrender.com/crops").then((res) => res.json()),
    ])
      .then(([licenseData, farmersData, cropsData]) => {
        setLicenses(licenseData || []);
        setFarmers(farmersData || []);
        setCrops(cropsData || []);
      })
      .catch((err) => console.error("Gov Fetch Error:", err));
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <GovSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#f6f7f3] min-h-screen">
        <div className="flex items-center justify-between">
  
  {/* Title stays left exactly as before */}
  <h1 className="text-3xl font-semibold text-[#3e5e40]">
    Government Dashboard
  </h1>

    {/* Right: Logout + Logo */}
  <div className="flex items-center gap-4">
    <button
      onClick={handleLogout}
      className="text-sm text-[#3e5e40] underline underline-offset-2 hover:text-[#2c4630] transition"
    >
      Logout
    </button>

    <img
      src={logo}
      alt="Ghirass Logo"
      className="h-20 cursor-pointer hover:opacity-80 transition"
      onClick={() => navigate("/")}
    />
  </div>
</div>
        
        <p className="text-gray-600 mb-6">
          Monitoring farms, licenses, and crop distribution across cities.
        </p>

        {activeTab === "overview" && (
          <GovOverviewTab
            farmers={farmers}
            crops={crops}
            licenses={licenses}
          />
        )}

        {activeTab === "licenses" && (
          <GovLicensesTab licenses={licenses} />
        )}

        {activeTab === "farms" && (
          <GovFarmsTab farmers={farmers} crops={crops} />
        )}

        {activeTab === "reports" && (
          <GovReportsTab farmers={farmers} crops={crops} />
        )}
      </div>
    </div>
  );
}
