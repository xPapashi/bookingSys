const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  duration: {
    type: Number, // in minutes
    required: false,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
