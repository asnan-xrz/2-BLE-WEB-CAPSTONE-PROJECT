const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  nrp: { type: String, required: true }, // NRP of the user
  mataKuliah: { type: String, required: true }, // Mata Kuliah for the device
  rssi: { type: Number, required: true }, // RSSI signal strength
  timestamp: { type: Date, default: Date.now }, // Timestamp for the detection
});

module.exports = mongoose.model('Device', deviceSchema);
