import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f7f3] flex flex-col items-center justify-center text-center px-6">
      {/* Logo / Title */}
      <h1 className="text-4xl font-semibold text-[#3e5e40] mb-4">
        Ghirass Smart Agriculture System
      </h1>
      <p className="text-gray-600 max-w-md mb-12">
        Welcome to Ghirass, the integrated platform connecting farmers, buyers, 
        and administrators for efficient smart farming management.
      </p>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/farmer-login")}
          className="bg-[#8fae8d] hover:bg-[#7da07b] text-white font-medium px-8 py-3 rounded-lg shadow transition-all duration-200"
        >
          Login as Farmer
        </button>

        <button
          onClick={() => navigate("/buyer")}
          className="bg-[#8fae8d] hover:bg-[#7da07b] text-white font-medium px-8 py-3 rounded-lg shadow transition-all duration-200"
        >
          Login as Buyer
        </button>

        <button
          onClick={() => navigate("/admin")}
          className="bg-[#8fae8d] hover:bg-[#7da07b] text-white font-medium px-8 py-3 rounded-lg shadow transition-all duration-200"
        >
          Login as Admin
        </button>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-12">
        © 2025 Ghirass Project – Smart Agriculture Dashboard
      </p>
    </div>
  );
}
