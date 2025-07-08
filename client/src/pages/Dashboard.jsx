import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../AuthContext";

// Mock dostępnych dat (YYYY-MM-DD)
const availableDates = ["2025-07-10", "2025-07-12", "2025-07-17", "2025-07-22"];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const monthName = today.toLocaleString("default", { month: "long" });

  // Przygotowanie kalendarza
  const generateCalendarGrid = () => {
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null); // Puste sloty przed 1.
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
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

      {/* Kalendarz */}
      <div className="bg-white rounded-2xl p-4 shadow mb-8">
        <h2 className="text-center text-lg font-medium text-[#000200] mb-4">
          {monthName} {year}
        </h2>

        {/* Dni tygodnia */}
        <div className="grid grid-cols-7 text-center text-sm text-[#000200] font-medium mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
            <div key={index} className="h-6 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>

        {/* Dni miesiąca */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, i) =>
            day ? (
              <button
                key={i}
                onClick={() => navigate(`/select-time?date=${day.value}`)}
                className={`w-10 h-10 text-sm rounded-full flex items-center justify-center ${
                  day.isAvailable
                    ? "bg-[#fcd9d7] text-[#000200]"
                    : "text-gray-400"
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

      {/* Przyciski opcji */}
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
