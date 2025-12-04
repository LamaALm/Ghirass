import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { writeLog } from "./utils/logger";

export default function BuyerLogin() {
  const navigate = useNavigate();

  const [buyerData, setBuyerData] = useState({
    name: "",
    city: "",
    contact: "",
    username: "",
    password: "",
  });

  const cities = [
    "Dammam",
    "Dhahran",
    "Al Khobar",
    "Jubail",
    "Ras Tanura",
    "Abqaiq",
    "Al Ahsa",
  ];

  const [errors, setErrors] = useState({});
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleChange = (e) => {
    setBuyerData({ ...buyerData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------- Validation ----------
  const validateForm = () => {
    const newErrors = {};

    // name: letters + spaces only
    if (!buyerData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(buyerData.name.trim())) {
      newErrors.name = "Full name must contain letters only.";
    }

    // city
    if (!buyerData.city) {
      newErrors.city = "Please select your city.";
    }

    // contact: 10 digits
    if (!buyerData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d{10}$/.test(buyerData.contact.trim())) {
      newErrors.contact = "Contact number must be 10 digits (numbers only).";
    }

    // username
    if (!buyerData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    // password
    if (!buyerData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (buyerData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Sign up ----------
  const handleSignUp = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // 1) Make sure username is unique in /users
    fetch(
      `https://ghirass-api.onrender.com/users?username=${buyerData.username}`
    )
      .then((res) => res.json())
      .then((existing) => {
        if (existing.length > 0) {
          setErrors((prev) => ({
            ...prev,
            username: "This username is already taken.",
          }));
          return;
        }

        // 2) Create buyer in /buyers
        fetch("https://ghirass-api.onrender.com/buyers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buyerData),
        })
          .then((res) => res.json())
          .then(() => {
            // 3) Add to /users table with role Buyer
            fetch("https://ghirass-api.onrender.com/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: buyerData.name,
                username: buyerData.username,
                city: buyerData.city,
                role: "Buyer",
              }),
            });

            alert("Account created successfully! You can now log in.");
            setIsLoginMode(true);
          })
          .catch((err) => console.error("Error creating buyer:", err));
      })
      .catch((err) => console.error("Error checking username:", err));
  };

  // ---------- Login ----------
  const handleLogin = (e) => {
    e.preventDefault();

    fetch(
      `https://ghirass-api.onrender.com/buyers?username=${buyerData.username}&password=${buyerData.password}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          localStorage.setItem("buyerData", JSON.stringify(data[0]));
          alert(`Welcome, ${data[0].name}!`);
          writeLog(data[0].username, "Buyer login success", "Info");
          navigate("/buyer"); // تأكدي إن هذا هو مسار BuyerDashboard
        } else {
          setErrors((prev) => ({
            ...prev,
            login: "Invalid username or password.",
          }));
          writeLog(
            buyerData.username,
            "Failed buyer login attempt",
            "Warning"
          );
        }
      })
      .catch((err) => console.error("Error logging in buyer:", err));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f6f7f3] px-4">
      {/* Back arrow row */}
      <button
        onClick={() =>
          isLoginMode ? navigate("/") : setIsLoginMode(true)
        }
        className="mb-4 text-sm text-gray-500 hover:text-[#3e5e40] self-start max-w-md w-full"
      >
        ← {isLoginMode ? "Back to main page" : "Back to login"}
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#e0e6dc]">
        <h1 className="text-3xl font-semibold text-[#3e5e40] text-center mb-2">
          {isLoginMode ? "Buyer Login" : "Buyer Registration"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {isLoginMode
            ? "Please enter your buyer credentials to access the marketplace."
            : "Please enter your information to create a buyer account."}
        </p>

        <form
          onSubmit={isLoginMode ? handleLogin : handleSignUp}
          className="space-y-4"
        >
          {/* Registration-only fields */}
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={buyerData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  City
                </label>
                <select
                  name="city"
                  value={buyerData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                >
                  <option value="">Select your city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={buyerData.contact}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
                />
                {errors.contact && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.contact}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={buyerData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
            />
            {errors.username && (
              <p className="text-red-600 text-xs mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={buyerData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {errors.login && (
            <p className="text-red-600 text-xs">{errors.login}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg font-medium transition-all duration-200"
          >
            {isLoginMode ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrors({});
            }}
            className="text-[#3e5e40] hover:underline text-sm"
          >
            {isLoginMode
              ? "Don't have an account? Register"
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