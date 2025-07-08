const AvailableSlotSchema = new mongoose.Schema({
  date: String, // format YYYY-MM-DD
  time: String, // format HH:mm
  isBooked: { type: Boolean, default: false }
});
module.exports = mongoose.model('AvailableSlot', AvailableSlotSchema);