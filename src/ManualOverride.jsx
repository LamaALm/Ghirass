import { useEffect, useState } from "react";

export default function ManualOverride({ onStatusChange }) {
  const [isManual, setIsManual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(5); // minutes
  const [remaining, setRemaining] = useState(0); // seconds

  // countdown logic
  useEffect(() => {
    if (!isManual || remaining <= 0) return;
    const timer = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [isManual, remaining]);

  // switch back to automatic when countdown ends
  useEffect(() => {
    if (isManual && remaining <= 0) {
      setIsManual(false);
      onStatusChange?.("Automatic");
    }
  }, [remaining, isManual, onStatusChange]);

  const startManual = () => {
    setIsManual(true);
    setRemaining(duration * 60);
    onStatusChange?.("Manual");
    setShowModal(false);
  };

  const stopManual = () => {
    setIsManual(false);
    setRemaining(0);
    onStatusChange?.("Automatic");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Irrigation Control</h3>
          <p
            className={`text-xl font-medium ${
              isManual ? "text-orange-600" : "text-green-700"
            }`}
          >
            {isManual
              ? `Manual Mode (${formatTime(remaining)})`
              : "Automatic Mode"}
          </p>

          {/* Progress bar */}
          {isManual && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                        className="bg-orange-500 h-2 transition-all duration-500"
                        style={{
                            width: `${(remaining / (duration * 60)) * 100}%`,
                        }}
                    ></div>
                </div>
            )}


        </div>

        {isManual ? (
          <button
            onClick={stopManual}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Stop Manual
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
          >
            Manual Override
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              Activate Manual Override
            </h4>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Duration (minutes):
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={startManual}
                className="px-3 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
