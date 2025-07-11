import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function MyAppointments() {
  const { user, token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          user?.role === "admin"
            ? "http://localhost:5000/api/appointments"
            : "http://localhost:5000/api/appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load appointments");

        const data = await res.json();
        setAppointments(data);
        setFilteredAppointments(data);
        if (user?.role === "admin") {
          const names = [
            ...new Set(
              data.map((a) =>
                a.userId ? `${a.userId.firstName} ${a.userId.lastName}` : ""
              )
            ),
          ];
          setSuggestions(names);
        }
      } catch (err) {
        console.error(err);
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, token]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === "") {
      setFilteredAppointments(appointments);
      return;
    }

    const filtered = appointments.filter((appt) => {
      const fullName = appt.userId
        ? `${appt.userId.firstName} ${appt.userId.lastName}`.toLowerCase()
        : "";
      return fullName.includes(term.toLowerCase());
    });

    setFilteredAppointments(filtered);
  };

  return (
    <div className="min-h-screen bg-[#ffedee] p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[#000200] flex items-center gap-2"
      >
        <ArrowLeft size={24} />
        Back
      </button>

      <h1 className="text-2xl font-semibold text-[#000200] mb-4">
        {user?.role === "admin" ? "Customer Appointments" : "My Appointments"}
      </h1>

      {user?.role === "admin" && (
        <div className="mb-6">
          <label className="block text-[#000200] mb-1 font-medium">
            Filter by client name:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="e.g., Anna Nowak"
            list="client-suggestions"
            className="w-full p-3 rounded border border-gray-300"
          />
          <datalist id="client-suggestions">
            {suggestions.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>
      )}

      {loading ? (
        <p className="text-[#000200]">Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-[#000200]">
          {user?.role === "admin"
            ? "No matching appointments."
            : "You don't have any appointments yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {filteredAppointments.map((appt, i) => (
            <li
              key={i}
              className="bg-white rounded-xl shadow p-4 text-[#000200]"
            >
              <p>
                <strong>Date:</strong> {appt.date}
              </p>
              <p>
                <strong>Time:</strong> {appt.time}
              </p>
              <p>
                <strong>Service:</strong>{" "}
                {typeof appt.service === "object"
                  ? appt.service.name
                  : appt.service}
              </p>
              {user?.role === "admin" && appt.userId && (
                <p>
                  <strong>Client:</strong> {appt.userId.firstName}{" "}
                  {appt.userId.lastName}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
