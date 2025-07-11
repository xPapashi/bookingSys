const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");

// Middleware to extract user from token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// POST: Create appointment
router.post("/", authenticateToken, async (req, res) => {
  const { date, time, service } = req.body;

  try {
    const newAppointment = await Appointment.create({
      userId: req.user.id,
      date,
      time,
      service,
    });
    res.json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch logged-in user's appointments
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Admin view – all appointments
router.get("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  try {
    const appointments = await Appointment.find().populate("userId", "firstName lastName");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
