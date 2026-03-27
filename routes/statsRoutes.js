const express = require('express');
const router = express.Router();
const {
  getStats,
  getTrends,
  getCategoryStats,
  getWardStats,
} = require('../controllers/statsController.js');

// GET /stats
router.get('/', getStats);

// GET /stats/trends?range=24h|7d|30d
router.get('/trends', getTrends);

// GET /stats/categories
router.get('/categories', getCategoryStats);

// GET /stats/wards
router.get('/wards', getWardStats);

module.exports = router;
