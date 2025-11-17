import React, { useState, useEffect } from "react";
import GovSidebar from "./components/GovSidebar";
import GovOverviewTab from "./components/GovOverviewTab";
import GovLicensesTab from "./components/GovLicensesTab";
import GovFarmsTab from "./components/GovFarmsTab";
import GovReportsTab from "./components/GovReportsTab";

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [licenses, setLicenses] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);

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
        <h1 className="text-3xl font-semibold text-[#3e5e40] mb-2">
          Government Dashboard
        </h1>
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
