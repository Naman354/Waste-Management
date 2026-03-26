const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController.js');

// GET /stats
router.get('/', getStats);

module.exports = router;
