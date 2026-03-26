const express = require('express');
const router = express.Router();
const { updateDriverLocation, getDrivers } = require('../controllers/driverController.js');

// POST /driver/location
router.post('/location', updateDriverLocation);

// GET /drivers
router.get('/', getDrivers);

module.exports = router;
