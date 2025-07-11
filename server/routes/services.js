const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const { authenticate, requireAdmin } = require("../middleware/auth"); // ✅ Correct import

// Get all services (public)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// Create a new service (admin only)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    const newService = new Service({ name, description, price, duration });
    await newService.save();

    res.status(201).json(newService);
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Failed to create service" });
  }
});

module.exports = router;
