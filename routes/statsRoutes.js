const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// GET /stats
router.get('/', getStats);

module.exports = router;
