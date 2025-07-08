const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  durationMinutes: Number,
  price: Number,
  isActive: { type: Boolean, default: true },
});
module.exports = mongoose.model("Service", ServiceSchema);
