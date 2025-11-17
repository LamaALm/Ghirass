import React from "react";
import { Home, FileBadge, Building2, BarChart2 } from "lucide-react";

export default function GovSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", name: "Overview", icon: Home },
    { id: "licenses", name: "Farmer Licenses", icon: FileBadge },
    { id: "farms", name: "Farms", icon: Building2 },
    { id: "reports", name: "Reports", icon: BarChart2 },
  ];

  return (
    <div className="w-64 h-screen bg-[#f1f4ef] border-r border-[#dfe5dc] p-5">
      <h2 className="text-xl font-semibold text-[#3e5e40] mb-6">
        Ministry Panel
      </h2>

      <div className="space-y-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center w-full px-4 py-3 gap-3 rounded-lg font-medium transition ${
                activeTab === t.id
                  ? "bg-[#8FAE8D] text-white"
                  : "text-[#3e5e40] hover:bg-[#e6ece5]"
              }`}
            >
              <Icon size={18} />
              {t.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
