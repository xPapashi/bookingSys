import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Tymczasowe dane (mock)
const mockServices = [
  { _id: "1", name: "Manicure" },
  { _id: "2", name: "Pedicure" },
  { _id: "3", name: "Henna brwi" },
];

const mockTimes = ["10:30 AM", "11:00 AM", "12:30 PM", "6:00 PM"];

// Funkcja do formatu daty: YYYY-MM-DD → DD-MM-YY
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
    // TODO: W przyszłości POST do backendu

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

      {/* Data */}
      <p className="text-[#000200] mb-4">
        Date: <strong>{formatDate(selectedDate)}</strong>
      </p>

      {/* Usługa */}
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

      {/* Godziny */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {mockTimes.map((time) => (
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

      {/* Potwierdzenie */}
      <button
        onClick={handleConfirm}
        className="w-full bg-[#e79992] text-white font-medium py-3 rounded-xl hover:brightness-95 transition"
      >
        Confirm
      </button>
    </div>
  );
}
