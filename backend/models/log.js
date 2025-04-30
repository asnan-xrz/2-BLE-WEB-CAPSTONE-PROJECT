const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  esp32Id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  nrp: { type: String, required: true }, // NRP of the user
  mataKuliah: { type: String, required: true }, // Mata Kuliah for the device
  rssi: { type: Number, required: true }, // RSSI signal strength
});

module.exports = mongoose.model('Log', logSchema);
