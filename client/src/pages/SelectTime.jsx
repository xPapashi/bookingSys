import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const mockServices = [
  { _id: "1", name: "Manicure" },
  { _id: "2", name: "Pedicure" },
  { _id: "3", name: "Eyebrow Tint" },
];

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

  const [selectedService, setSelectedService] = useState(mockServices[0]._id);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchTimes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/availability");
        const data = await res.json();
        const match = data.find((d) => d.date === selectedDate);
        const sortedTimes = match
          ? [...match.times].sort((a, b) => {
              return new Date(`1970-01-01T${a}`) - new Date(`1970-01-01T${b}`);
            })
          : [];
        setAvailableTimes(sortedTimes);
      } catch (err) {
        console.error("Error fetching times:", err);
        setAvailableTimes([]);
      }
    };

    fetchTimes();
  }, [selectedDate]);

  const handleConfirm = () => {
    if (!selectedTime) {
      alert("Please select a time.");
      return;
    }

    const appointmentData = {
      date: selectedDate,
      time: selectedTime,
      serviceId: selectedService,
    };

    console.log("Booking appointment:", appointmentData);
    alert("Appointment booked!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#ffedee] px-6 pt-8">
      {/* Header */}
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
        {mockServices.map((service) => (
          <option key={service._id} value={service._id}>
            {service.name}
          </option>
        ))}
      </select>

      {availableTimes.length === 0 ? (
        <p className="text-[#000200] text-center mb-8">
          No time slots available.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`py-3 rounded-xl border text-sm ${
                selectedTime === time
                  ? "bg-[#e79992] text-white"
                  : "bg-white text-[#000200] border-gray-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="w-full bg-[#e79992] text-white font-medium py-3 rounded-xl hover:brightness-95 transition"
      >
        Confirm
      </button>
    </div>
  );
}
