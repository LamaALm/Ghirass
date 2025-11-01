// src/PestAlerts.jsx
import { useEffect, useMemo, useState } from "react";

const pests = [
  { name: "Aphids", tip: "Apply neem oil spray in early morning." },
  { name: "Whitefly", tip: "Use yellow sticky traps and improve airflow." },
  { name: "Spider Mites", tip: "Mist leaves; consider miticide if severe." },
  { name: "Leaf Miner", tip: "Prune affected leaves; rotate crops." },
  { name: "Thrips", tip: "Introduce beneficial insects or blue traps." },
];

const severities = [
  { key: "low", label: "Low",   color: "bg-green-100 text-green-700 border-green-200" },
  { key: "medium", label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { key: "high", label: "High",  color: "bg-red-100 text-red-700 border-red-200" },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function newAlert() {
  const pest = pests[rand(0, pests.length - 1)];
  const sev = severities[rand(0, severities.length - 1)].key;
  return {
    id: crypto.randomUUID(),
    pest: pest.name,
    severity: sev,           // "low" | "medium" | "high"
    recommendation: pest.tip,
    at: new Date().toISOString(),
    read: false,
  };
}

function timeAgo(iso) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default function PestAlerts() {

      // NEW: دالة تصدير التنبيهات إلى CSV
  const exportCSV = () => {
    const rows = [
      ["id","pest","severity","recommendation","timestamp","read"],
      ...alerts.map(a => [
        a.id,
        a.pest,
        a.severity,
        `"${a.recommendation.replace(/"/g,'""')}"`,
        a.at,
        a.read
      ])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pest-alerts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };


  const [alerts, setAlerts] = useState([
    { id: crypto.randomUUID(), pest: "Aphids", severity: "medium", recommendation: pests[0].tip, at: new Date(Date.now()-1000*60*3).toISOString(), read: false },
    { id: crypto.randomUUID(), pest: "Whitefly", severity: "low", recommendation: pests[1].tip, at: new Date(Date.now()-1000*60*8).toISOString(), read: true },
  ]);
  const [filter, setFilter] = useState("all"); // all | unread | high

  // auto-generate a new alert every 10s
  useEffect(() => {
    const iv = setInterval(() => {
      setAlerts(prev => {
        const next = [newAlert(), ...prev];
        return next.slice(0, 12); // keep last 12
      });
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  const unreadCount = useMemo(() => alerts.filter(a => !a.read).length, [alerts]);

  const filtered = useMemo(() => {
    if (filter === "unread") return alerts.filter(a => !a.read);
    if (filter === "high") return alerts.filter(a => a.severity === "high");
    return alerts;
  }, [alerts, filter]);

  const colorFor = (sev) => severities.find(s => s.key === sev)?.color || "bg-gray-100 text-gray-700 border-gray-200";

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  const clearAll = () => setAlerts([]);

  const toggleRead = (id) => setAlerts(prev => prev.map(a => a.id === id ? ({ ...a, read: !a.read }) : a));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Pest Alerts</h3>
          <span className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            🔔 Unread: {unreadCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm ${filter==="all" ? "bg-gray-100" : "bg-white"} hover:bg-gray-100`}
              title="Show all alerts"
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm border-l ${filter==="unread" ? "bg-gray-100" : "bg-white"} hover:bg-gray-100`}
              title="Show unread only"
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-3 py-1.5 text-sm border-l ${filter==="high" ? "bg-gray-100" : "bg-white"} hover:bg-gray-100`}
              title="Show High risk only"
            >
              High
            </button>
          </div>

          <button onClick={markAllRead} className="px-3 py-1.5 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800">
            Mark all read
          </button>
          <button onClick={clearAll} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
            Clear
          </button>
          <button onClick={exportCSV} className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Export CSV
          </button>

        </div>
      </div>

      {/* List */}
      <div className="mt-4 divide-y">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500 py-6 text-center">No alerts to display.</div>
        )}

        {filtered.map((a) => (
          <div key={a.id} className="py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className={`shrink-0 mt-0.5 px-2 py-0.5 text-xs rounded-full border ${colorFor(a.severity)}`}>
                {a.severity === "high" ? "High" : a.severity === "medium" ? "Medium" : "Low"}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    🪲 {a.pest}
                    {!a.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle" title="unread"></span>}
                  </p>
                  <span className="text-xs text-gray-500">• {timeAgo(a.at)}</span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5">{a.recommendation}</p>
              </div>
            </div>
            <button
              onClick={() => toggleRead(a.id)}
              className={`text-xs px-2 py-1 rounded-lg border hover:bg-gray-50 ${a.read ? "text-gray-600 border-gray-200" : "text-blue-700 border-blue-200"}`}
              title={a.read ? "Mark as unread" : "Mark as read"}
            >
              {a.read ? "Unread" : "Read"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}   
