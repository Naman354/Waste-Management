const express = require('express');
const router = express.Router();
const { createComplaint } = require('../controllers/complaintController');

// POST /complaint
router.post('/', createComplaint);

module.exports = router;
