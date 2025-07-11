import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function Admin() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Availability state
  const [date, setDate] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);
  const [message, setMessage] = useState("");

  // Service state
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // Availability handlers
  const handleAddTime = () => {
    if (timeInput && !times.includes(timeInput)) {
      setTimes([...times, timeInput]);
      setTimeInput("");
    }
  };

  const handleRemoveTime = (timeToRemove) => {
    setTimes(times.filter((t) => t !== timeToRemove));
  };

  const handleSubmitAvailability = async (e) => {
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

  // Service handlers
  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleServiceChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...serviceForm,
          price: parseFloat(serviceForm.price),
          duration: parseInt(serviceForm.duration),
        }),
      });

      if (!res.ok) throw new Error("Failed to add service");

      setServiceForm({ name: "", description: "", price: "", duration: "" });
      fetchServices();
    } catch (err) {
      alert("Failed to create service");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#ffedee] p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#000200] flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <h1 className="text-2xl font-semibold text-[#000200] mb-4">
        Admin Panel
      </h1>

      {/* Availability Form */}
      <form
        onSubmit={handleSubmitAvailability}
        className="bg-white rounded-2xl shadow p-4 max-w-md mx-auto mb-6"
      >
        <h2 className="text-lg font-medium mb-4 text-[#000200]">
          Availability Settings
        </h2>

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
          <p className="mt-4 text-center text-[#000200] font-medium">
            {message}
          </p>
        )}
      </form>

      {/* Service Form */}
      <form
        onSubmit={handleServiceSubmit}
        className="bg-white rounded-2xl shadow p-4 max-w-md mx-auto"
      >
        <h2 className="text-lg font-medium mb-4 text-[#000200]">
          Add New Service
        </h2>

        <input
          name="name"
          value={serviceForm.name}
          onChange={handleServiceChange}
          placeholder="Service name"
          className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300"
        />

        <textarea
          name="description"
          value={serviceForm.description}
          onChange={handleServiceChange}
          placeholder="Description"
          className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300"
        />

        <input
          name="price"
          value={serviceForm.price}
          onChange={handleServiceChange}
          type="number"
          step="0.01"
          placeholder="Price"
          className="w-full mb-3 px-4 py-3 rounded-xl border border-gray-300"
        />

        <input
          name="duration"
          value={serviceForm.duration}
          onChange={handleServiceChange}
          type="number"
          placeholder="Duration (minutes)"
          className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-300"
        />

        <button
          type="submit"
          className="bg-[#e79992] text-white w-full py-3 rounded-xl"
        >
          Add Service
        </button>
      </form>

      {/* Services List */}
      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-lg font-medium text-[#000200] mb-2">
          Current Services
        </h2>
        <ul className="space-y-3">
          {services.map((s) => (
            <li
              key={s._id}
              className="bg-white p-4 rounded-xl shadow text-[#000200]"
            >
              <p className="font-semibold">{s.name}</p>
              {s.description && <p className="text-sm">{s.description}</p>}
              {s.price && (
                <p className="text-sm text-gray-600">Price: £{s.price.toFixed(2)}</p>
              )}
              {s.duration && (
                <p className="text-sm text-gray-600">Duration: {s.duration} min</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
