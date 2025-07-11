const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { authenticate, requireAdmin } = require("../middleware/auth");

// POST: Create appointment
router.post("/", authenticate, async (req, res) => {
  const { date, time, service } = req.body;

  try {
    const newAppointment = await Appointment.create({
      userId: req.user._id,
      date,
      time,
      service,
    });
    res.json(newAppointment);
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch logged-in user's appointments
router.get("/my", authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate("service", "name") // Populate only service name
      .sort({ date: -1, time: 1 }); // Optional: Sort by date descending, time ascending
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching user appointments:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Admin view – all appointments
router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("userId", "firstName lastName")
      .populate("service", "name")
      .sort({ date: -1, time: 1 }); // Optional: latest first
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching admin appointments:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Taken times for a specific date
router.get("/booked-times", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Missing date" });

  try {
    const appointments = await Appointment.find({ date });
    const takenTimes = appointments.map((appt) => appt.time);
    res.json(takenTimes);
  } catch (err) {
    console.error("Error fetching booked times:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
