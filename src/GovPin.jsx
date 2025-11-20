import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GovPin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const GOV_PIN = "5566";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pin === GOV_PIN) {
      navigate("/government");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f6f7f3]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-[#e0e6dc]">
        <h2 className="text-2xl font-semibold text-[#3e5e40] mb-4 text-center">
          Government Portal Security
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-1 focus:ring-[#8fae8d]"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#8fae8d] text-white p-2 rounded-lg hover:bg-[#7da07b]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

