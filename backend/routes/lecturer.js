const express = require('express');
const Device = require('../models/device');
const router = express.Router();
const checkRole = require('../middleware/checkRole');

// Lecturer route to fetch devices with new columns
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find(); // Get all devices with new schema
    res.json(devices);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/lecturer-dashboard', checkRole(['admin', 'lecturer']), (req, res) => {
  res.send('Welcome to Lecturer Dashboard');
});

module.exports = router;
