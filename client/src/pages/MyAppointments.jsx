import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function MyAppointments() {
  const { user, token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error(err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, token]);

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

      {loading ? (
        <p className="text-[#000200]">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-[#000200]">
          {user?.role === "admin"
            ? "No customer appointments yet."
            : "You don't have any appointments yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt, i) => (
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
                <strong>Service:</strong> {appt.service}
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
