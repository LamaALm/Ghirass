import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GovLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = (e) => {
  e.preventDefault();
  setError("");

  const inputUsername = username.trim().toLowerCase();
  const inputPassword = password;

  // Fetch all users and filter manually (case-insensitive)
  fetch("https://ghirass-api.onrender.com/users")
    .then((res) => res.json())
    .then((users) => {
      const matched = users.find(
        (u) =>
          u.role === "Government" &&
          u.username &&
          u.username.trim().toLowerCase() === inputUsername &&
          u.password === inputPassword
      );

      if (matched) {
        localStorage.setItem("currentUser", JSON.stringify(matched));
        navigate("/gov-pin");
      } else {
        setError("Invalid government credentials.");
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      setError("Error connecting to the server.");
    });
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f6f7f3] px-4">
      {/* Back to main page */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-600 hover:text-[#3e5e40] transition text-sm"
        >
          <span className="text-base">←</span>
          <span>Back to main page</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#e0e6dc]">
        <h1 className="text-3xl font-semibold text-[#3e5e40] text-center mb-2">
          Government Portal Login
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Please enter your ministry account credentials.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8fae8d]"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#8fae8d] hover:bg-[#7da07b] text-white py-2 rounded-lg font-medium transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>

      <p className="text-gray-500 text-sm mt-8">
        © 2025 Ghirass Smart Agriculture Project
      </p>
    </div>
  );
}