import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSlots(res.data.slots);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-[#ffedee] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#000200]">Admin Panel</h1>

      {/* Lista dostępnych dni */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-[#000200]">Available Slots</h2>
        <ul className="bg-white p-4 rounded-xl shadow">
          {availableSlots.map((slot, i) => (
            <li key={i} className="py-2 border-b last:border-b-0">
              {slot.date} – {slot.times.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {/* TODO: Dodawanie nowych dni i godzin */}
    </div>
  );
}
