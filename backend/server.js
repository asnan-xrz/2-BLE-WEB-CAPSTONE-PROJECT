const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
require('dotenv').config();
const Device = require('./models/device');
const Log = require('./models/log');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ---------------------------------------------------------------------------------------------------------------------------

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://localhost'); // Use your broker's URL

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('esp32/device-data', (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log('Successfully subscribed to esp32/device-data');
    }
  });
});

// Listen for messages on the esp32/device-data topic
// Backend untuk clear dan update data setiap 5 detik
client.on('message', async (topic, message) => {
  if (topic === 'esp32/device-data') {
    const deviceData = JSON.parse(message.toString()); // Parse the incoming JSON message

    console.log('Received device data:', deviceData);

    try {
      // Step 1: Hapus semua data perangkat yang lama di collection "devices"
      await Device.deleteMany({}); // Menghapus semua data perangkat

      console.log('All devices cleared from database.');

      // Step 2: Simpan data perangkat yang baru ke dalam collection "devices"
      const device = new Device({
        deviceId: deviceData.deviceId,
        nrp: deviceData.nrp,
        mataKuliah: deviceData.mataKuliah,
        rssi: deviceData.rssi,
        timestamp: new Date(deviceData.timestamp),
      });
      await device.save();
      console.log('Device data saved:', device);

      // Step 3: Simpan log baru ke dalam collection "logs"
      const log = new Log({
        deviceId: deviceData.deviceId,
        esp32Id: deviceData.esp32Id,
        timestamp: new Date(),
        nrp: deviceData.nrp,
        mataKuliah: deviceData.mataKuliah,
        rssi: deviceData.rssi,
      });
      await log.save();
      console.log('Log data saved:', log);
    } catch (err) {
      console.error('Error saving data to the database:', err);
    }
  }
});



// -----------------------------------------------------------------------------------------------------------------------------

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const lecturerRoutes = require('./routes/lecturer');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
