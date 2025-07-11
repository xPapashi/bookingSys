import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/availability");
        const data = await res.json();
        setAvailability(data);

        const full = [];

        for (const item of data) {
          const resTaken = await fetch(
            `http://localhost:5000/api/appointments/booked-times?date=${item.date}`
          );
          const taken = await resTaken.json();
          if (taken.length >= item.times.length) {
            full.push(item.date);
          }
        }

        setFullyBookedDates(full);
      } catch (err) {
        console.error("Failed to fetch availability or taken slots:", err);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString("default", { month: "long" });

  const generateCalendarGrid = () => {
    const grid = [];
    const availableMap = Object.fromEntries(
      availability.map((a) => [a.date, true])
    );

    for (let i = 0; i < firstDayOfMonth; i++) grid.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      if (availableMap[dateStr]) {
        grid.push({
          label: day,
          value: dateStr,
          isAvailable: true,
          isFullyBooked: fullyBookedDates.includes(dateStr),
        });
      } else {
        grid.push({
          label: day,
          value: dateStr,
          isAvailable: false,
        });
      }
    }

    return grid;
  };

  const calendarDays = generateCalendarGrid();

  return (
    <div className="min-h-screen bg-[#ffedee] px-6 pt-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-[#e79992] mb-6">
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#000200] mb-8">
          Hi, {user?.firstName || "there"}!
        </h1>
      </div>

      <p className="text-[#000200] text-3xl mb-8">Select an available time</p>

      <div className="bg-white rounded-2xl p-4 shadow mb-8">
        <h2 className="text-center text-lg font-medium text-[#000200] mb-4">
          {monthName} {year}
        </h2>

        <div className="grid grid-cols-7 text-center text-sm text-[#000200] font-medium mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
            <div key={index} className="h-6 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, i) =>
            day ? (
              <button
                key={i}
                onClick={() =>
                  day.isAvailable &&
                  !day.isFullyBooked &&
                  navigate(`/select-time?date=${day.value}`)
                }
                disabled={!day.isAvailable || day.isFullyBooked}
                className={`w-10 h-10 text-sm rounded-full flex items-center justify-center ${
                  !day.isAvailable
                    ? "text-gray-300"
                    : day.isFullyBooked
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#fcd9d7] text-[#000200]"
                }`}
              >
                {day.label}
              </button>
            ) : (
              <div key={i} className="w-10 h-10" />
            )
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button
          onClick={() => navigate("/appointments")}
          className="bg-white text-[#000200] text-xl py-4 px-4 rounded-xl shadow flex justify-between items-center"
        >
          {user?.role === "admin" ? "Customer Appointments" : "My Appointments"}
          <ChevronRight className="text-[#e79992]" />
        </button>

        <button
          onClick={() => navigate("/history")}
          className="bg-white text-[#000200] text-xl py-4 px-4 rounded-xl shadow flex justify-between items-center"
        >
          Treatment History <ChevronRight className="text-[#e79992]" />
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="bg-white text-[#000200] text-xl py-4 px-4 rounded-xl shadow flex justify-between items-center"
        >
          Settings <ChevronRight className="text-[#e79992]" />
        </button>
      </div>
    </div>
  );
}
