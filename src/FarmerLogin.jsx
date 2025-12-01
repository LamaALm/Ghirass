import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { writeLog } from "./utils/logger";


export default function FarmerLogin() {
  const navigate = useNavigate();

  // Form state
  const [farmerData, setFarmerData] = useState({
    name: "",
    farmName: "",
    city: "",
    contact: "",
    licenseNumber: "",
    username: "",
    password: "",
  });

    const cities = [
    "Dammam",
    "Dhahran",
    "Al Khobar",
    "Jubail",
    "Ras Tanura",
    "Al Ahsa",
  ];

  const [errors, setErrors] = useState({});


  const [isLoginMode, setIsLoginMode] = useState(true); // switch between login/signup

  // Handle form input
  const handleChange = (e) => {
    setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
  };


const validateForm = () => {
  let newErrors = {};

  // Full name: required + letters only
  if (!farmerData.name.trim()) {
    newErrors.name = "Full name is required";
  } else if (!/^[A-Za-z\s]+$/.test(farmerData.name.trim())) {
    newErrors.name = "Full name must contain letters only";
  }

  // Farm name: required + letters only
  if (!farmerData.farmName.trim()) {
    newErrors.farmName = "Farm name is required";
  } else if (!/^[A-Za-z\s]+$/.test(farmerData.farmName.trim())) {
    newErrors.farmName = "Farm name must contain letters only";
  }

  // City
  if (!farmerData.city) {
    newErrors.city = "Select your city";
  }

  // Contact: digits only + 10 digits
  if (!farmerData.contact.trim()) {
    newErrors.contact = "Contact number is required";
  } else if (!/^\d+$/.test(farmerData.contact)) {
    newErrors.contact = "Contact number must contain digits only";
  } else if (farmerData.contact.length !== 10) {
    newErrors.contact = "Contact number must be 10 digits";
  }

  // Username
  if (!farmerData.username.trim()) {
    newErrors.username = "Username is required";
  }

  // Password
  if (farmerData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


// Sign Up: add new farmer to db.json
const handleSignUp = (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // نحول اليوزرنيم إلى lowercase مرة واحدة
  const normalizedUsername = farmerData.username.trim().toLowerCase();

  if (
    !farmerData.name ||
    !normalizedUsername ||
    !farmerData.password ||
    !farmerData.city ||
    !farmerData.licenseNumber
  ) {
    alert("Please fill all required fields.");
    return;
  }

  // Step 0 — Check if username already exists (CASE-INSENSITIVE)
  fetch("https://ghirass-api.onrender.com/users")
    .then((res) => res.json())
    .then((existingUsers) => {
      const usernameExists = existingUsers.some(
        (u) => u.username && u.username.toLowerCase() === normalizedUsername
      );

      if (usernameExists) {
        alert("This username already exists. Please choose another one.");
        return;
      }

      // Step 1 — Check license validity
      fetch(
        `https://ghirass-api.onrender.com/licenses?licenseNumber=${farmerData.licenseNumber}`
      )
        .then((res) => res.json())
        .then((licenseMatch) => {
          if (licenseMatch.length === 0) {
            alert("Invalid license number. Please contact the Ministry.");
            return;
          }

          // Step 2 — Create farmer (نخزن اليوزرنيم بشكل lowercase)
          fetch("https://ghirass-api.onrender.com/farmers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...farmerData,
              username: normalizedUsername,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              // Step 3 — Add to users table (برضه lowercase)
              fetch("https://ghirass-api.onrender.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: farmerData.name,
                  username: normalizedUsername,
                  city: farmerData.city,
                  role: "Farmer",
                }),
              });

              alert("Account created successfully! You can now log in.");
              setIsLoginMode(true);
            });
        });
    });
};





// Login: verify username & password
const handleLogin = (e) => {
  e.preventDefault();

  const inputUsername = farmerData.username.trim().toLowerCase();

  // نجيب كل المزارعين ونفلتر بالفرونت (case-insensitive)
  fetch("https://ghirass-api.onrender.com/farmers")
    .then((res) => res.json())
    .then((farmers) => {
      const matchedFarmer = farmers.find(
        (f) =>
          f.username &&
          f.username.toLowerCase() === inputUsername &&
          f.password === farmerData.password
      );

      if (matchedFarmer) {
        // Successful login
        localStorage.setItem("farmerData", JSON.stringify(matchedFarmer));
        alert(`Welcome back, ${matchedFarmer.name}!`);
        navigate("/farmer");
        writeLog(matchedFarmer.username, "Farmer login success", "Info");
      } else {
        alert("Invalid username or password.");
        writeLog(
          inputUsername,
          "Failed farmer login attempt",
          "Warning"
        );
      }
    })
    .catch((err) => console.error("Error logging in:", err));
};


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f6f7f3] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#e0e6dc]">
        {isLoginMode && (
          <div className="w-full max-w-md mb-4">
            <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-600 hover:text-[#3e5e40] transition text-sm"
            >
              <span className="text-base">←</span>
              <span>Back to main page</span>
            </button>
            </div>
        )}
        {!isLoginMode && (
          <button
          type="button"
          onClick={() => setIsLoginMode(true)}
          className="flex items-center text-sm text-[#3e5e40] mb-0 hover:underline"
          >
            <span className="text-xl">←</span>
          </button>
        )}
        <h1 className="text-3xl font-semibold text-[#3e5e40] text-center mb-2">
          {isLoginMode ? "Farmer Login" : "Farmer Register"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {isLoginMode
            ? "Welcome back! Please log in to access your dashboard."
            : "Please enter your farm information to register."}
        </p>

        <form
          onSubmit={isLoginMode ? handleLogin : handleSignUp}
          className="space-y-4"
        >
          {/* For sign up only */}
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={farmerData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Farm Name
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={farmerData.farmName}
                  onChange={handleChange}
                  placeholder="Enter farm name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                />
                {errors.farmName && <p className="text-red-600 text-sm">{errors.farmName}</p>}
              </div>

              <div>
                  <label className="block text-gray-700 text-sm mb-1">City</label>
                    <select
                      name="city"
                      value={farmerData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                      required
                    >
                      <option value="">Select your city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={farmerData.contact}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                />
                {errors.contact && <p className="text-red-600 text-sm">{errors.contact}</p>}
              </div>
              <div>
  <label className="block text-gray-700 text-sm mb-1">License Number</label>
  <input
    type="text"
    name="licenseNumber"
    value={farmerData.licenseNumber}
    onChange={handleChange}
    placeholder="Enter your license number"
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
    required
  />
 
</div>

            </>
          )}

          {/* Username and Password for both modes */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={farmerData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
              required
            />
            {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={farmerData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
              required
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg font-medium transition-all duration-200"
          >
            {isLoginMode ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-[#3e5e40] hover:underline text-sm"
          >
            {isLoginMode
              ? "Don't have an account? Register up here"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-8">
        © 2025 Ghirass Smart Agriculture Project
      </p>
    </div>
  );
}
