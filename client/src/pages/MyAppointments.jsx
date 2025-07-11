import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { AuthContext } from "../AuthContext";

export default function MyAppointments() {
  const { user, token } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchService, setSearchService] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [serviceSuggestions, setServiceSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const endpoint = user?.role === "admin"
          ? "http://localhost:5000/api/appointments"
          : "http://localhost:5000/api/appointments/my";

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load appointments");

        const data = await res.json();
        setAppointments(data);
        setFilteredAppointments(data);

        if (user?.role === "admin") {
          const names = [
            ...new Set(
              data.map(a =>
                a.userId ? `${a.userId.firstName} ${a.userId.lastName}` : ""
              )
            ),
          ];
          setNameSuggestions(names);
        }

        const services = [
          ...new Set(
            data.map(a =>
              typeof a.service === "object" ? a.service.name : a.service
            )
          ),
        ];
        setServiceSuggestions(services);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, user]);

  useEffect(() => {
    let results = [...appointments];

    if (searchName.trim()) {
      results = results.filter((a) => {
        const fullName = a.userId
          ? `${a.userId.firstName} ${a.userId.lastName}`.toLowerCase()
          : "";
        return fullName.includes(searchName.toLowerCase());
      });
    }

    if (searchDate) {
      results = results.filter((a) => a.date === searchDate);
    }

    if (searchService) {
      results = results.filter((a) => {
        const serviceName =
          typeof a.service === "object" ? a.service.name : a.service;
        return serviceName === searchService;
      });
    }

    results.sort((a, b) => {
      const d1 = new Date(a.date + "T" + a.time);
      const d2 = new Date(b.date + "T" + b.time);
      return sortOrder === "asc" ? d1 - d2 : d2 - d1;
    });

    setFilteredAppointments(results);
  }, [searchName, searchDate, searchService, sortOrder, appointments]);

  return (
    <div className="min-h-screen bg-[#ffedee] px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#000200] flex items-center gap-2"
      >
        <ArrowLeft size={24} />
        Back
      </button>

      <h1 className="text-xl font-bold text-[#000200] mb-4">
        {user?.role === "admin" ? "Customer Appointments" : "My Appointments"}
      </h1>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full bg-white rounded-xl border border-gray-300 px-4 py-3 flex items-center justify-between text-sm font-medium text-[#000200] mb-4 shadow"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
        {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="grid gap-4 mb-4 transition-all">
          {user?.role === "admin" && (
            <div>
              <label className="block text-sm text-[#000200] mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., Anna Nowak"
                list="client-suggestions"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
              />
              <datalist id="client-suggestions">
                {nameSuggestions.map((n, i) => (
                  <option key={i} value={n} />
                ))}
              </datalist>
            </div>
          )}

          <div>
            <label className="block text-sm text-[#000200] mb-1">Date</label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-[#000200] mb-1">Service</label>
            <select
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
            >
              <option value="">All Services</option>
              {serviceSuggestions.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#000200] mb-1">Sort</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Appointments */}
      {loading ? (
        <p className="text-[#000200] text-sm">Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-[#000200] text-sm">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredAppointments.map((appt, i) => (
            <li
              key={i}
              className="bg-white rounded-2xl shadow px-4 py-3 text-sm text-[#000200]"
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
