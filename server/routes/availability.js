const express = require("express");
const router = express.Router();
const Availability = require("../models/AvailableSlot");

// Get all available slots
router.get("/", async (req, res) => {
  const slots = await Availability.find();
  res.json(slots);
});

// Add or update availability for a date
router.post("/", async (req, res) => {
  const { date, times } = req.body;

  try {
    const existing = await Availability.findOne({ date });
    if (existing) {
      existing.times = times;
      await existing.save();
      return res.json(existing);
    } else {
      const newAvailability = await Availability.create({ date, times });
      return res.json(newAvailability);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
