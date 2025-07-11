import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [availableDates, setAvailableDates] = useState([]);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const monthName = today.toLocaleString("default", { month: "long" });

  // 🔄 Fetch availability from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/availability");
        const data = await res.json();
        setAvailableDates(data.map((a) => a.date));
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };
    fetchAvailability();
  }, []);

  // 📅 Build the calendar grid
  const generateCalendarGrid = () => {
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      daysArray.push({
        label: day,
        value: dateStr,
        isAvailable: availableDates.includes(dateStr),
      });
    }

    return daysArray;
  };

  const calendarDays = generateCalendarGrid();

  return (
    <div className="min-h-screen bg-[#ffedee] px-6 pt-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-[#e79992] mb-6">
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#000200] mb-8">
          Hi, {user?.firstName || "there"}!
        </h1>
      </div>

      <p className="text-[#000200] text-3xl mb-8">Select an available time</p>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-4 shadow mb-8">
        <h2 className="text-center text-lg font-medium text-[#000200] mb-4">
          {monthName} {year}
        </h2>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center text-sm text-[#000200] font-medium mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
            <div key={index} className="h-6 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, i) =>
            day ? (
              <button
                key={i}
                onClick={() => day.isAvailable && navigate(`/select-time?date=${day.value}`)}
                className={`w-10 h-10 text-sm rounded-full flex items-center justify-center ${
                  day.isAvailable
                    ? "bg-[#fcd9d7] text-[#000200]"
                    : "text-gray-400 cursor-not-allowed"
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

      {/* Option Buttons */}
      <div className="flex flex-col gap-4 max-w-sm mx-auto">
        <button
          onClick={() => navigate("/appointments")}
          className="bg-white text-[#000200] text-xl py-4 px-4 rounded-xl shadow flex justify-between items-center"
        >
          My Appointments <ChevronRight className="text-[#e79992]" />
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
