import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../AuthContext";

const formatDate = (input) => {
  if (!input) return "";
  const [year, month, day] = input.split("-");
  return `${day}-${month}-${year}`;
};

export default function SelectTime() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date");
  const { token } = useContext(AuthContext);

  const [times, setTimes] = useState([]);
  const [takenTimes, setTakenTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  // Fetch available slots for this date
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/availability");
        const data = await res.json();
        const day = data.find((d) => d.date === selectedDate);
        setTimes(day?.times || []);
      } catch (err) {
        console.error("Error fetching available times:", err);
      }
    };

    const fetchTaken = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/appointments/booked-times?date=${selectedDate}`);
        const data = await res.json();
        setTakenTimes(data);
      } catch (err) {
        console.error("Error fetching booked times:", err);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/services");
        const data = await res.json();
        setServices(data);
        setSelectedService(data[0]?._id || "");
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchTimes();
    fetchTaken();
    fetchServices();
  }, [selectedDate]);

  const handleConfirm = async () => {
    if (!selectedTime || !selectedService) {
      alert("Please select a time and service.");
      return;
    }

    const appointment = {
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
    };

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointment),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("Appointment booked!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffedee] px-6 pt-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-[#e79992] mr-4">
          <ArrowLeft size={30} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#000200]">
          Select Date & Time
        </h1>
      </div>

      <p className="text-[#000200] mb-4">
        Date: <strong>{formatDate(selectedDate)}</strong>
      </p>

      <label className="text-[#000200] mb-2 block">Choose a service</label>
      <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        className="mb-6 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none"
      >
        {services.map((service) => (
          <option key={service._id} value={service._id}>
            {service.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {times.map((time) => {
          const isTaken = takenTimes.includes(time);
          return (
            <button
              key={time}
              onClick={() => !isTaken && setSelectedTime(time)}
              disabled={isTaken}
              className={`py-3 rounded-xl border text-sm ${
                isTaken
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : selectedTime === time
                  ? "bg-[#e79992] text-white"
                  : "bg-white text-[#000200] border-gray-300"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        className="w-full bg-[#e79992] text-white font-medium py-3 rounded-xl hover:brightness-95 transition"
      >
        Confirm
      </button>
    </div>
  );
}
