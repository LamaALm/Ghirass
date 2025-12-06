import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PlusCircle, Edit2, Trash2, X } from "lucide-react";
import { writeLog } from "./utils/logger";
import { useNavigate } from "react-router-dom";
import logo from "./Ghirass-Logo.png";

export default function FarmerDashboard() {


  const navigate = useNavigate();
  // Get logged-in farmer info from localStorage
  const farmerInfo = JSON.parse(localStorage.getItem("farmerData"));

  // Sensor state
const [temperature, setTemperature] = useState(null);
const [humidity, setHumidity] = useState(null);
const [soil, setSoil] = useState(null);
const [irrigationOn, setIrrigationOn] = useState(false);
const [reason, setReason] = useState("");
const [proba, setProba] = useState(null);
const [lastUpdated, setLastUpdated] = useState("");
const [isManualMode, setIsManualMode] = useState(false);



const handleLogout = () => {
  localStorage.removeItem("farmerData");
  window.location.href = "/"; 
};

  // UI control states
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Data for chart and alerts
// Generate last 5 days dynamically
const generateLast5Days = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay(); // 0–6
  let result = [];

  for (let i = 0; i < 5; i++) {
    const index = (today - i + 7) % 7; 
    result.push({
      day: days[index],
      soil: Math.floor(Math.random() * (65 - 30 + 1)) + 30, // random soil %
    });
  }

  return result.reverse(); 
};

// Soil moisture history (auto-generated)
const [soilHistory] = useState(generateLast5Days());
  const [alerts] = useState([
    { id: 1, message: "Possible pest detected near Lettuce area", date: "2025-11-01" },
    { id: 2, message: "Humidity dropped below safe level", date: "2025-10-31" },
  ]);

  // Crop data
  const [myCrops, setMyCrops] = useState([]);
  const [newCrop, setNewCrop] = useState({
    name: "",
    type: "",
    price: "",
    region: farmerInfo?.city || "",
    contact: farmerInfo?.contact || "",
    image: "",
    farmer: farmerInfo?.name || "Unknown Farmer",
    farmName: farmerInfo?.farmName || "",
  });

  const [cropToEdit, setCropToEdit] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Predefined crop images
  const cropImages = {
    Tomatoes: "https://tse1.mm.bing.net/th/id/OIP.7BgzPrvHKJguzWzo-LxGHwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    Lettuce: "https://daganghalal.blob.core.windows.net/28167/Product/1000x1000__90-1641813846461.jpg",
    Cucumber: "https://tse1.mm.bing.net/th/id/OIP.NLEueRgZNxrIrjfqxeug2gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    Strawberries: "https://www.bigfresh.ae/uploads/items/d07bbbda65c25016411db31fff4a4c1d.jpg",
    Eggplant: "https://kuwait.grandhyper.com/image/cache/catalog/products/1/1328-1000x1000.jpg",
    Peppers: "https://tse2.mm.bing.net/th/id/OIP.VHPKJVSwG_524u6QdUn_4gHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
    Grapes: "https://i5.walmartimages.com/asr/f236462b-dc7a-47ff-90d4-7281369ce012.7a2478c3d27e4526eac51d6fda7bf11f.jpeg",
  };

  // Fetch crops from JSON server
  const fetchCrops = () => {
    fetch("https://ghirass-api.onrender.com/crops")
      .then((res) => res.json())
      .then((data) => {
          const filtered = data.filter(
           (crop) => crop.farmerId === farmerInfo?.id
          );
          setMyCrops(filtered);
      })

      .catch((err) => console.error("Error fetching crops:", err));
  };
  useEffect(() => {
    fetchCrops();
  }, []);

  // Suggestion logic for crop name
  const cropNames = Object.keys(cropImages);
  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewCrop({ ...newCrop, name: value });
    if (value.length > 0) {
      const filtered = cropNames.filter((n) =>
        n.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else setSuggestions([]);
  };
  const handleSelectName = (name) => {
    setNewCrop({ ...newCrop, name, image: cropImages[name] || "" });
    setSuggestions([]);
  };

  // Add new crop
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit clicked ✅", newCrop);

    if (!newCrop.name || !newCrop.type || !newCrop.price) {
      alert("Please fill all required fields");
      return;
    }

    // Price must be a number > 0
const priceValue = Number(newCrop.price);
if (isNaN(priceValue) || priceValue <= 0) {
  alert("Price must be a positive number greater than zero.");
  return;
}

    const cropData = {
        ...newCrop,
        farmerId: farmerInfo?.id,
    };

    fetch("https://ghirass-api.onrender.com/crops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Crop added successfully!");
        setNewCrop({
          name: "",
          type: "",
          price: "",
          region: farmerInfo?.city || "",
          contact: farmerInfo?.contact || "",
          image: "",
          farmer: farmerInfo?.name || "Unknown Farmer",
          farmName: farmerInfo?.farmName || "",
        });
        setShowForm(false);
        fetchCrops();
        writeLog(farmerInfo.username, `Added new crop: ${newCrop.name}`, "Info");
      })

      .catch((err) => console.error("Error adding crop:", err));
  };

  // Delete crop
  const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to delete this crop?")) return;

  fetch(`https://ghirass-api.onrender.com/crops/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      writeLog(
        farmerInfo.username,
        `Deleted crop with ID: ${id}`,
        "Warning"
      );
      fetchCrops();
    })
    .catch((err) => console.error("Error deleting crop:", err));
};


  // Edit crop
  const handleEdit = (crop) => {
    setCropToEdit({ ...crop });
    setShowEditModal(true);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    // Price validation for Edit Mode
const editedPrice = Number(cropToEdit.price);
if (isNaN(editedPrice) || editedPrice <= 0) {
  alert("Price must be a positive number greater than zero.");
  return;
}
    fetch(`https://ghirass-api.onrender.com/crops/${cropToEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropToEdit),
    })
      .then(() => {
        alert("Crop updated successfully!");
        setShowEditModal(false);
        fetchCrops();
        writeLog(farmerInfo.username, `Updated crop: ${cropToEdit.name}`, "Info");

      })
      .catch((err) => console.error("Error updating crop:", err));
  };

// ===============================
// RANDOM DEMO MODE (Presentation)
// ===============================
useEffect(() => {
 
  const initialTimeout = setTimeout(() => {
    setTemperature(Math.floor(Math.random() * (35 - 20 + 1)) + 20);
    setHumidity(Math.floor(Math.random() * (75 - 40 + 1)) + 40);
    setSoil(Math.floor(Math.random() * (65 - 30 + 1)) + 30);
    setIrrigationOn(Math.random() > 0.5);
    setReason(Math.random() > 0.5 ? "AI detected dry soil" : "AI normal state");
    setProba((Math.random() * (0.99 - 0.5) + 0.5).toFixed(2));
    setLastUpdated(new Date().toLocaleString());
  }, 2000); 

  return () => clearTimeout(initialTimeout);
}, []);


useEffect(() => {
  const interval = setInterval(() => {
    setTemperature(Math.floor(Math.random() * (35 - 20 + 1)) + 20);
    setHumidity(Math.floor(Math.random() * (75 - 40 + 1)) + 40);
    setSoil(Math.floor(Math.random() * (65 - 30 + 1)) + 30);
    setIrrigationOn(Math.random() > 0.5);
    setReason(Math.random() > 0.5 ? "AI detected dry soil" : "AI normal state");
    setProba((Math.random() * (0.99 - 0.5) + 0.5).toFixed(2));
    setLastUpdated(new Date().toLocaleString());
  }, 60000); 

  return () => clearInterval(interval);
}, []);





  return (
    


    <div className="min-h-screen bg-[#f6f7f3] p-6 space-y-6 transition-all duration-300">
      {/* Header Row — Title (left) + Logo (right) */}
<div className="flex items-center justify-between">
  
  {/* Title stays left exactly as before */}
  <h1 className="text-3xl font-semibold text-[#3e5e40]">
    Farmer Dashboard
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

      

      {farmerInfo && (
        <p className="text-gray-600 mb-4">
            Welcome, <span className="font-semibold text-[#3e5e40]">{farmerInfo.name}</span> from {farmerInfo.city || "your farm"} 🌿
        </p>
      )}


      <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
      
{/* Environment Data Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">

<div className="bg-white p-5 rounded-xl shadow border border-[#e0e6dc] text-center">
  <h3 className="text-gray-600 text-sm font-medium">Temperature</h3>
  <p className="text-3xl font-semibold text-[#3e5e40] mt-2">
    {temperature !== null ? `${temperature}°C` : "Loading..."}
  </p>
  <p className="text-gray-500 text-xs mt-1">Range 20–35°C</p>
</div>


<div className="bg-white p-5 rounded-xl shadow border border-[#e0e6dc] text-center">
  <h3 className="text-gray-600 text-sm font-medium">Humidity</h3>
  <p className="text-3xl font-semibold text-[#3e5e40] mt-2">
    {humidity !== null ? `${humidity}%` : "Loading..."}
  </p>
  <p className="text-gray-500 text-xs mt-1">Range 40–75%</p>
</div>


<div className="bg-white p-5 rounded-xl shadow border border-[#e0e6dc] text-center">
  <h3 className="text-gray-600 text-sm font-medium">Soil Moisture</h3>
  <p className="text-3xl font-semibold text-[#3e5e40] mt-2">
    {soil !== null ? `${soil}%` : "Loading..."}
  </p>
  <p className="text-gray-500 text-xs mt-1">Range 30–65%</p>
</div>

</div>

{/* Irrigation Control Section */}
<div className="bg-white p-5 rounded-xl shadow border border-[#e0e6dc] mt-6 flex justify-between items-center">
  <div>
    <h3 className="text-gray-700 font-medium">Irrigation Control</h3>
    <p
      className={`text-sm font-semibold ${
        isManualMode ? "text-[#8b7f6b]" : "text-[#3e5e40]"
      }`}
    >
      {isManualMode ? "Manual Mode (Active)" : "Automatic Mode"}
    </p>
  </div>
  <button
    onClick={() => setIsManualMode(!isManualMode)}
    className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
      isManualMode
        ? "bg-[#a6b39f] hover:bg-[#93a58b]" // pastel sage gray
        : "bg-[#8fae8d] hover:bg-[#7da07b]" // soft green
    }`}
  >
    {isManualMode ? "Switch to Auto" : "Manual Override"}
  </button>
</div>

{/* Irrigation Pump Real Status */}
<div className="bg-white p-5 rounded-xl shadow border border-[#e0e6dc] mt-3 text-center">
  <h3 className="text-gray-700 font-medium mb-2">Irrigation Pump Status</h3>

  <p
    className={`text-2xl font-semibold ${
      irrigationOn ? "text-green-700" : "text-red-600"
    }`}
  >
    {irrigationOn ? "ON" : "OFF"}
  </p>

  <p className="text-sm text-gray-600 mt-2">
    Reason: {reason ? reason : "—"}
  </p>

  <p className="text-sm text-gray-600 mt-1">
    AI Probability: {proba ? proba : "—"}
  </p>
</div>

{/* Pest alerts */}
      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pest Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500 italic">No alerts at the moment.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id} className="border-l-4 border-red-500 pl-3 text-gray-700">
                <strong>{alert.date}:</strong> {alert.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Soil Moisture chart */}
<div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    Soil Moisture History
  </h2>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={soilHistory}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="soil" fill="#8fae8d" />
    </BarChart>
  </ResponsiveContainer>
</div>

  

      {/* Crop management */}
      <div className="bg-white p-4 rounded-xl shadow border border-[#e0e6dc] flex items-center justify-between">
        <p className="text-gray-700 font-medium">Manage your farm crops</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#8fae8d] hover:bg-[#7da07b] text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          <PlusCircle size={18} />
          {showForm ? "Close" : "Add Crop"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 relative">
            <div className="col-span-2 relative">
              <input
                type="text"
                placeholder="Crop Name"
                value={newCrop.name}
                onChange={handleNameChange}
                className="border rounded-lg p-2 w-full"
                required
              />
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border rounded-lg shadow mt-1 z-10">
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelectName(s)}
                      className="px-3 py-1 hover:bg-[#e8ede4] cursor-pointer text-gray-700"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <select
              value={newCrop.type}
              onChange={(e) => setNewCrop({ ...newCrop, type: e.target.value })}
              className="border rounded-lg p-2 bg-white"
              required
            >
              <option value="">Select Type</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
            </select>
            <input
              type="number"
              placeholder="Price (SAR)"
              value={newCrop.price}
              onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
              className="border rounded-lg p-2"
              required
            />
            <input
              type="text"
              placeholder="Region / City"
              value={newCrop.region}
              onChange={(e) => setNewCrop({ ...newCrop, region: e.target.value })}
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={newCrop.contact}
              onChange={(e) => setNewCrop({ ...newCrop, contact: e.target.value })}
              className="border rounded-lg p-2"
            />
            <button
              type="submit"
              className="col-span-2 bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg transition-all duration-200"
            >
              Save Crop
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow border border-[#e0e6dc]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Crops</h2>
        {myCrops.length === 0 ? (
          <p className="text-gray-500 italic">No crops added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {myCrops.map((crop) => (
              <div
                key={crop.id}
                className="bg-[#f9faf8] rounded-xl shadow-sm p-3 border border-[#e0e6dc] hover:shadow-md transition-all relative"
              >
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-28 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold text-[#3e5e40]">{crop.name}</h3>
                <p className="text-gray-600 text-sm">{crop.type}</p>
                <p className="text-[#678a66] text-sm font-medium">
                  {crop.price} SAR/kg
                </p>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Crop Modal */}
      {showEditModal && cropToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Crop</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                value={cropToEdit.name}
                onChange={(e) => setCropToEdit({ ...cropToEdit, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <select
                value={cropToEdit.type}
                onChange={(e) => setCropToEdit({ ...cropToEdit, type: e.target.value })}
                className="border p-2 rounded w-full bg-white"
              >
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit">Fruit</option>
              </select>
              <input
                type="number"
                value={cropToEdit.price}
                onChange={(e) => setCropToEdit({ ...cropToEdit, price: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={cropToEdit.region}
                onChange={(e) => setCropToEdit({ ...cropToEdit, region: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                value={cropToEdit.contact}
                onChange={(e) => setCropToEdit({ ...cropToEdit, contact: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <button
                type="submit"
                className="w-full bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg transition-all duration-200"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
