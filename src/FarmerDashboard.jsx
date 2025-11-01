import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PestAlerts from "./PestAlerts";
import ManualOverride from "./ManualOverride";

// helpers
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const rnd = (min, max) => Math.random() * (max - min) + min;

// generate a timestamp label like "14:05"
const timeLabel = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// small arrow indicator
function Trend({ value, prev }) {
  const diff = value - prev;
  const up = diff > 0.05;
  const down = diff < -0.05;
  const color = up ? "text-green-600" : down ? "text-red-600" : "text-gray-400";
  const symbol = up ? "↑" : down ? "↓" : "→";
  const sign = diff > 0 ? "+" : diff < 0 ? "" : "";
  return (
    <span className={`ml-2 text-sm ${color}`} title={`${sign}${diff.toFixed(1)}`}>
      {symbol}
    </span>
  );
}

export default function FarmerDashboard() {
  // initial realistic values
  const [sensor, setSensor] = useState({
    temperature: 28.5, // °C
    humidity: 63,      // %
    soilMoisture: 42,  // %
    irrigationStatus: "Automatic",
  });
  
  const [irrigationStatus, setIrrigationStatus] = useState("Automatic");


  const prevRef = useRef(sensor);
  const [series, setSeries] = useState([
    { name: timeLabel(), moisture: sensor.soilMoisture },
    { name: "", moisture: 38 },
    { name: "", moisture: 40 },
    { name: "", moisture: 42 },
    { name: "", moisture: 43 },
    { name: "", moisture: 41 },
  ]);

  // crop listings (static demo)
  const cropListings = useMemo(
    () => [
      { id: 1, name: "Tomatoes", status: "Available", price: "20 SAR", date: "2025-10-25" },
      { id: 2, name: "Lettuce", status: "Reserved", price: "10 SAR", date: "2025-10-26" },
    ],
    []
  );

  // live updates every 5s
  useEffect(() => {
    const iv = setInterval(() => {
      // gentle drift for realism
      const next = {
        temperature: clamp(sensor.temperature + rnd(-0.6, 0.6), 20, 35),
        humidity: clamp(sensor.humidity + rnd(-1.5, 1.5), 40, 75),
        soilMoisture: clamp(sensor.soilMoisture + rnd(-1.2, 1.2), 30, 65),
        irrigationStatus: sensor.irrigationStatus, // keep same for now
      };

      setSensor(next);

      // push into chart (keep last 6 points)
      setSeries((curr) => {
        const label = timeLabel();
        const updated = [...curr.slice(-5), { name: label, moisture: next.soilMoisture }];
        // fill empty labels if any
        return updated.map((d, i) => ({ ...d, name: d.name || (i === updated.length - 1 ? label : "") }));
      });

      prevRef.current = sensor;
    }, 5000);

    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensor]); // use current values as baseline for small drift

  const prev = prevRef.current;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 text-white p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">Ghirass</h1>
        <nav className="flex flex-col gap-3">
          <a href="#!" className="hover:bg-green-600 p-2 rounded">Dashboard</a>
          <a href="#!" className="hover:bg-green-600 p-2 rounded">Sensor Data</a>
          <a href="#!" className="hover:bg-green-600 p-2 rounded">Irrigation</a>
          <a href="#!" className="hover:bg-green-600 p-2 rounded">Pest Alerts</a>
          <a href="#!" className="hover:bg-green-600 p-2 rounded">Marketplace</a>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Farmer Dashboard</h2>
          <div className="text-gray-500">Welcome, Basmah</div>
        </header>

        {/* Content */}
        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Sensor cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 transition-colors">
              <h3 className="text-lg font-semibold">Temperature</h3>
              <p className="text-2xl text-green-700 flex items-baseline">
                {sensor.temperature.toFixed(1)}°C
                <Trend value={sensor.temperature} prev={prev.temperature} />
              </p>
              <p className="text-xs text-gray-500 mt-1">Range 20–35°C</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4 transition-colors">
              <h3 className="text-lg font-semibold">Humidity</h3>
              <p className="text-2xl text-green-700 flex items-baseline">
                {sensor.humidity.toFixed(0)}%
                <Trend value={sensor.humidity} prev={prev.humidity} />
              </p>
              <p className="text-xs text-gray-500 mt-1">Range 40–75%</p>
            </div>

            <div className="bg-white rounded-xl shadow p-4 transition-colors">
              <h3 className="text-lg font-semibold">Soil Moisture</h3>
              <p className="text-2xl text-green-700 flex items-baseline">
                {sensor.soilMoisture.toFixed(0)}%
                <Trend value={sensor.soilMoisture} prev={prev.soilMoisture} />
              </p>
              <p className="text-xs text-gray-500 mt-1">Range 30–65%</p>
            </div>
          </div>

          {/* LOW SOIL MOISTURE ALERT */}
          {sensor.soilMoisture < 35 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-red-800 font-medium">
                  Low soil moisture detected ({sensor.soilMoisture.toFixed(0)}%)
                </p>
                <p className="text-red-700 text-sm">
                    Recommendation: Start a short irrigation cycle or increase automatic threshold.
                </p>
            </div>
        )}

        {/* Manual Override Section */}
        <ManualOverride onStatusChange={setIrrigationStatus} />






          {/* Irrigation status */}
          <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Irrigation Status</h3>
              <p className="text-xl text-green-700">{sensor.irrigationStatus}</p>
              <p
              className={`text-xl font-medium ${
                irrigationStatus === "Manual" ? "text-orange-600" : "text-green-700"
                }`}
              >
                  {irrigationStatus} Mode
              </p>

            </div>
            <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
              Manual Override
            </button>
          </div>

          {/* Soil moisture chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Soil Moisture Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={series}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="moisture" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>


          <PestAlerts />


          {/* Listings */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">My Crop Listings</h3>
              <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                Add New
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {cropListings.map((crop) => (
                  <tr key={crop.id} className="border-b hover:bg-gray-100">
                    <td className="p-2">{crop.name}</td>
                    <td className="p-2">{crop.status}</td>
                    <td className="p-2">{crop.price}</td>
                    <td className="p-2">{crop.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
