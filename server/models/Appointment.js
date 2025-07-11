// const mongoose = require('mongoose');

// const AppointmentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
//   date: String,
//   time: String,
//   status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
//   note: String,
//   createdAt: { type: Date, default: Date.now }
// });
// module.exports = mongoose.model('Appointment', AppointmentSchema);

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
