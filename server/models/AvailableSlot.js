const mongoose = require('mongoose');

const AvailableSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  times: [
    {
      start: { type: String, required: true }, // e.g. "09:00"
      end:   { type: String, required: true }  // e.g. "09:30"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AvailableSlot', AvailableSlotSchema);
