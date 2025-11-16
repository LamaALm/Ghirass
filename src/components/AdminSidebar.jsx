import React from "react";
import { Home, Users, Leaf, BarChart2, Shield, Settings } from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "farmers", label: "Farmers", icon: Users },
    { id: "crops", label: "Crops", icon: Leaf },
    { id: "users", label: "Users", icon: Users },
    { id: "logs", label: "Security Logs", icon: Shield },
    { id: "maintenance", label: "Maintenance", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-[#f1f4ef] border-r border-[#dfe5dc] p-5 flex flex-col">
      <h2 className="text-xl font-semibold text-[#3e5e40] mb-6">
        Admin Panel
      </h2>

      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition
                ${
                  activeTab === tab.id
                    ? "bg-[#8FAE8D] text-white"
                    : "text-[#3e5e40] hover:bg-[#e6ece5]"
                }
              `}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
