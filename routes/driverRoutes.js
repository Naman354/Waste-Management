const express = require('express');
const router = express.Router();
const {
  updateDriverLocation,
  updateDriverLocationsBulk,
  getDrivers,
} = require('../controllers/driverController.js');

// POST /driver/location
router.post('/location', updateDriverLocation);
router.post('/location/bulk', updateDriverLocationsBulk);

// GET /drivers
router.get('/', getDrivers);

module.exports = router;
