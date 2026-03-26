const express = require('express');
const router = express.Router();
const { getDriverRoute } = require('../controllers/routeController');

// GET /route/driver
router.get('/driver', getDriverRoute);

module.exports = router;
