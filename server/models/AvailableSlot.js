const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },     // Format: YYYY-MM-DD
  times: [{ type: String }]                   // Format: ["10:00", "11:00", ...]
});

module.exports = mongoose.model("Availability", availabilitySchema);
