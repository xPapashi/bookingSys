import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Admin() {
  const [date, setDate] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAddTime = () => {
    if (timeInput && !times.includes(timeInput)) {
      setTimes([...times, timeInput]);
      setTimeInput("");
    }
  };

  const handleRemoveTime = (timeToRemove) => {
    setTimes(times.filter((t) => t !== timeToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, times }),
      });
      const data = await res.json();
      setMessage("✅ Availability saved successfully!");
    } catch (err) {
      setMessage("❌ Error saving availability.");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffedee] p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#000200] flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <h1 className="text-2xl font-semibold text-[#000200] mb-4">
        Admin Panel – Availability Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-4 max-w-md mx-auto"
      >
        <label className="block mb-4">
          <span className="text-[#000200] font-medium">Select Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-1 p-2 rounded border border-gray-300"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-[#000200] font-medium">Add Time Slot:</span>
          <div className="flex gap-2 mt-1">
            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="flex-1 p-2 rounded border border-gray-300"
            />
            <button
              type="button"
              onClick={handleAddTime}
              className="bg-[#ff6b6b] text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </label>

        {times.length > 0 && (
          <div className="mb-4">
            <span className="text-[#000200] font-medium">Available Times:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {times.map((time, i) => (
                <span
                  key={i}
                  className="bg-[#ffb6b6] text-[#000200] px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {time}
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(time)}
                    className="ml-2 text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-[#000200] text-white w-full py-2 rounded mt-2"
        >
          Save Availability
        </button>

        {message && (
          <p className="mt-4 text-center text-[#000200] font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}
